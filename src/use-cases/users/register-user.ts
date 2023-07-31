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
              {
                name: 'Housing',
                color: ColorEnum.RED,
                description: 'Expenses for your living arrangements.',
              },
              {
                name: 'Transportation',
                color: ColorEnum.ORANGE,
                description: 'Costs related to getting around.',
              },
              {
                name: 'Education',
                color: ColorEnum.LIGHT_BLUE,
                description: 'Expenses for schooling and personal development.',
              },
              {
                name: 'Clothing',
                color: ColorEnum.BLUE,
                description: 'Costs for clothing and accessories.',
              },
              {
                name: 'Eletronics',
                color: ColorEnum.PURPLE,
                description: 'Expenses for electronic devices and gadgets.',
              },
              {
                name: 'Entertainment',
                color: ColorEnum.PINK,
                description: 'Spending on leisure activities and recreation.',
              },
              {
                name: 'Streaming',
                color: ColorEnum.PINK,
                description: 'Costs for streaming services.',
              },
              {
                name: 'Food',
                color: ColorEnum.BROWN,
                description: 'Expenses for groceries and dining.',
              },
              {
                name: 'Medical & Healthcare',
                color: ColorEnum.LIGHT_GREEN,
                description: 'Costs for medical care and health insurance.',
              },
              {
                name: 'Saving & Investing',
                color: ColorEnum.GREEN,
                description: 'Contributions towards savings and investments.',
              },
              {
                name: 'Recreation & Entertainment',
                color: ColorEnum.TEAL,
                description: 'Expenses for recreational activities.',
              },
              {
                name: 'Others',
                color: ColorEnum.GREY,
                description:
                  'Miscellaneous expenses not fitting in other categories.',
              },
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
