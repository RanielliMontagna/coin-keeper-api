import { Transaction, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { TransactionRepository } from '../transaction-repository'

export class PrismaTransactionRepository implements TransactionRepository {
  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    return transaction
  }

  async findManyByAccountId(accountId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { account_id: accountId },
    })

    return transactions
  }

  async create(transaction: Prisma.TransactionUncheckedCreateInput) {
    const createdTransaction = await prisma.transaction.create({
      data: transaction,
    })

    return createdTransaction
  }

  async delete(id: string) {
    const deletedTransaction = await prisma.transaction.delete({
      where: { id },
    })

    return deletedTransaction
  }
}
