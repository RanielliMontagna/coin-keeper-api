import { hash } from 'bcryptjs'
import { Prisma, type User } from '@prisma/client'

import type { UserRepository } from '@/repositories/user-repository'
import { OrganizationRepository } from '@/repositories/organization-repository'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

import { account, categories, configs } from '@/constants/seeds'

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  organizationId?: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    organizationId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const createUser = async (values: Prisma.UserUncheckedCreateInput) => {
      const hashedPassword = await hash(password, 8)

      const user = await this.userRepository.create({
        ...values,
        password_hash: hashedPassword,
        Account: { create: account },
        Category: { createMany: { data: categories } },
        Config: { createMany: { data: configs } },
      })

      return user
    }

    if (organizationId) {
      const organization = await this.organizationRepository.findById(
        organizationId,
      )

      if (!organization) {
        throw new OrganizationNotFoundError()
      }

      const hashedPassword = await hash(password, 8)

      const user = await createUser({
        name,
        email,
        password_hash: hashedPassword,
        type: UserTypeEnum.GUEST,
        organization_id: organizationId,
      })

      return { user }
    } else {
      const organization = await this.organizationRepository.create({
        name: `${name}'s organization`,
      })

      const hashedPassword = await hash(password, 8)

      const user = await createUser({
        name,
        email,
        password_hash: hashedPassword,
        type: UserTypeEnum.ADMIN,
        organization_id: organization.id,
      })

      return { user }
    }
  }
}
