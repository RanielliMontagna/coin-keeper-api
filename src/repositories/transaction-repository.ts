import type { Prisma, Transaction } from '@prisma/client'

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>
  findManyByAccountId(accountId: string): Promise<Transaction[]>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}
