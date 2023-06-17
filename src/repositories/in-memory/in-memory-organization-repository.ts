import { randomUUID } from 'node:crypto'

import { Organization, Prisma } from '@prisma/client'
import { OrganizationRepository } from '../organization-repository'

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public organizations: Organization[] = []

  async create(organization: Prisma.OrganizationCreateInput) {
    const newOrganization: Organization = {
      id: randomUUID(),
      name: organization.name,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.organizations.push(newOrganization)

    return newOrganization
  }
}
