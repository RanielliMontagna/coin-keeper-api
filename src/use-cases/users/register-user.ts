import type { User } from '@prisma/client'
import type { UserRepository } from '@/repositories/user-repository'
import { OrganizationRepository } from '@/repositories/organization-repository'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  photo?: string
  type: UserTypeEnum
  organizationId: string
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
    type,
    photo,
    organizationId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const organization = await this.organizationRepository.findById(
      organizationId,
    )

    if (!organization) {
      throw new OrganizationNotFoundError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      type,
      photo,
      organization_id: organizationId,
    })

    return { user }
  }
}
