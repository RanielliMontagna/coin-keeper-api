import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { UserRepository } from '../user-repository'

export class PrismaUserRepository implements UserRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return user
  }

  async create(user: Prisma.UserUncheckedCreateInput) {
    const createdUser = await prisma.user.create({
      data: user,
    })

    return createdUser
  }
}
