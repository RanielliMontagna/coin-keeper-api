import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import {
  FindManyByUserIdOptions,
  RecurringTransactionRepository,
} from '@/repositories/recurring-transaction-repository'

export class PrismaRecurringTransactionRepository
  implements RecurringTransactionRepository
{
  async findById(id: string) {
    const recurringTransaction = await prisma.recurringTransaction.findUnique({
      where: { id },
    })

    if (!recurringTransaction) return null
    if (recurringTransaction.deleted_at) return null

    return recurringTransaction
  }

  async findManyByUserId(userId: string, options?: FindManyByUserIdOptions) {
    const { page = 1, all } = options || {}
    const select = {
      id: true,
      title: true,
      description: true,
      amount: true,
      type: true,
      frequency: true,
      start_date: true,
      end_date: true,
      account: { select: { id: true, name: true, institution: true } },
      category: { select: { id: true, name: true, color: true } },
    }

    if (all) {
      const recurringTransactions = await prisma.recurringTransaction.findMany({
        where: { user_id: userId, deleted_at: null },
        select: select,
      })

      return recurringTransactions
    }

    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { user_id: userId, deleted_at: null },
      take: 15,
      skip: (page - 1) * 15,
      orderBy: { created_at: 'desc' },
      select: select,
    })

    return recurringTransactions
  }

  async create(
    recurringTransaction: Prisma.RecurringTransactionUncheckedCreateInput,
  ) {
    const createdRecurringTransaction =
      await prisma.recurringTransaction.create({
        data: recurringTransaction,
      })

    return createdRecurringTransaction
  }

  async delete(id: string) {
    await prisma.recurringTransaction.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }
}
