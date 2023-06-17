import { randomUUID } from 'node:crypto'

import type { Organization, Prisma } from '@prisma/client'
import type { OrganizationRepository } from '../organization-repository'

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public organizations: Organization[] = []

  async findById(id: string) {
    const organization = this.organizations.find((o) => o.id === id)

    if (!organization) {
      return null
    }

    return organization
  }

  async create(organization: Prisma.OrganizationCreateInput) {
    const newOrganization: Organization = {
      id: organization.id || randomUUID(),
      name: organization.name,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.organizations.push(newOrganization)

    return newOrganization
  }
}
