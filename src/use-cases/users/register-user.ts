import type { User } from '@prisma/client'
import type { UserRepository } from '@/repositories/user-repository'
import { OrganizationRepository } from '@/repositories/organization-repository'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  photo?: string
  organizationId?: string
  googleId: string
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
    photo,
    organizationId,
    googleId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    if (organizationId) {
      const organization = await this.organizationRepository.findById(
        organizationId,
      )

      if (!organization) {
        throw new OrganizationNotFoundError()
      }

      const user = await this.userRepository.create({
        name,
        email,
        photo,
        type: UserTypeEnum.GUEST,
        organization_id: organizationId,
        google_id: googleId,
      })

      return { user }
    } else {
      const organization = await this.organizationRepository.create({
        name: `${name}'s organization`,
      })

      const user = await this.userRepository.create({
        name,
        email,
        photo,
        type: UserTypeEnum.ADMIN,
        organization_id: organization.id,
        google_id: googleId,
      })

      return { user }
    }
  }
}
