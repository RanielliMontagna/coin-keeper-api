import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import {
  AccountRepository,
  FindManyByUserIdOptions,
} from '../account-repository'

export class PrismaAccountRepository implements AccountRepository {
  async findById(id: string) {
    const account = await prisma.account.findUnique({
      where: { id },
    })

    if (!account) return null
    if (account.deleted_at) return null

    return account
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const accounts = await prisma.account.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        name: {
          contains: options?.search,
          mode: 'insensitive',
        },
      },
    })

    return accounts
  }

  async create(account: Prisma.AccountUncheckedCreateInput) {
    const createdAccount = await prisma.account.create({
      data: account,
    })

    return createdAccount
  }

  async update(account: Prisma.AccountUncheckedUpdateInput) {
    const updatedAccount = await prisma.account.update({
      where: { id: account.id as string },
      data: account,
    })

    return updatedAccount
  }
  async delete(id: string) {
    await prisma.account.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }
}
