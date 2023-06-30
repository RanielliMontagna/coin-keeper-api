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

    return account
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const accounts = await prisma.account.findMany({
      where: {
        user_id: userId,
        name: {
          contains: options?.search,
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
    const deletedAccount = await prisma.account.delete({
      where: { id },
    })

    return deletedAccount
  }
}
