import type { Prisma, Organization } from '@prisma/client'

export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>
  create(organization: Prisma.OrganizationCreateInput): Promise<Organization>
}
