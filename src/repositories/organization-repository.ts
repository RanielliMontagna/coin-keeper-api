import { Prisma, Organization } from '@prisma/client'

export interface OrganizationRepository {
  create(organization: Prisma.OrganizationCreateInput): Promise<Organization>
}
