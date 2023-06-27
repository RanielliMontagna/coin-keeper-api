import type { Organization } from '@prisma/client'
import type { OrganizationRepository } from '@/repositories/organization-repository'

interface RegisterOrganizationUseCaseRequest {
  name: string
}

interface RegisterOrganizationUseCaseResponse {
  organization: Organization
}

export class RegisterOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    name,
  }: RegisterOrganizationUseCaseRequest): Promise<RegisterOrganizationUseCaseResponse> {
    const organization = await this.organizationRepository.create({
      name,
    })

    return {
      organization,
    }
  }
}
