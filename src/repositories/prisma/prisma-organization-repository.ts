import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { OrganizationRepository } from '../organization-repository'

export class PrismaOrganizationRepository implements OrganizationRepository {
  async findById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
    })

    return organization
  }

  async create(organization: Prisma.OrganizationCreateInput) {
    const createdOrganization = await prisma.organization.create({
      data: organization,
    })

    return createdOrganization
  }
}
