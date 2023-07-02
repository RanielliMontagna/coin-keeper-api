import type { Account, Category, Prisma, Transaction } from '@prisma/client'

interface TransactionWithAccount {
  id: Transaction['id']
  title: Transaction['title']
  description: Transaction['description']
  amount: Transaction['amount']
  type: Transaction['type']
  date: Transaction['date']
  account: {
    id: Account['id']
    name: Account['name']
  }
  category: {
    id: Category['id']
    name: Category['name']
    color: Category['color']
  }
}
export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>
  findManyByAccountId(accountId: string): Promise<Transaction[]>
  findManyByUserId(userId: string): Promise<TransactionWithAccount[]>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}
