import { hash } from 'bcryptjs'
import { Prisma, type User } from '@prisma/client'

import type { UserRepository } from '@/repositories/user-repository'
import { OrganizationRepository } from '@/repositories/organization-repository'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

import { InstitutionEnum } from '../accounts/create-account'
import { ColorEnum } from '../categories/create-category'

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
        Account: {
          create: {
            name: 'Wallet',
            balance: 0,
            institution: InstitutionEnum.OTHER,
          },
        },
        Category: {
          createMany: {
            data: [
              { name: 'Housing', color: ColorEnum.RED },
              { name: 'Transportation', color: ColorEnum.ORANGE },
              { name: 'Education', color: ColorEnum.LIGHT_BLUE },
              { name: 'Clothing', color: ColorEnum.BLUE },
              { name: 'Eletronics', color: ColorEnum.PURPLE },
              { name: 'Entertainment', color: ColorEnum.PINK },
              { name: 'Services', color: ColorEnum.YELLOW },
              { name: 'Food', color: ColorEnum.BROWN },
              { name: 'Medical & Healthcare', color: ColorEnum.LIGHT_GREEN },
              { name: 'Saving & Investing', color: ColorEnum.GREEN },
              { name: 'Recreation & Entertainment', color: ColorEnum.TEAL },
              { name: 'Others', color: ColorEnum.GREY },
            ],
          },
        },
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
