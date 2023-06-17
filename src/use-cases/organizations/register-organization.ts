import { Organization } from '@prisma/client'

import { OrganizationRepository } from '@/repositories/organization-repository'

interface RegisterOrganizationCaseRequest {
  name: string
}

interface RegisterOrganizationCaseResponse {
  organization: Organization
}

export class RegisterOrganizationCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    name,
  }: RegisterOrganizationCaseRequest): Promise<RegisterOrganizationCaseResponse> {
    const organization = await this.organizationRepository.create({
      name,
    })

    return {
      organization,
    }
  }
}
