import type { Account, Category, Prisma, Transaction } from '@prisma/client'
import { Options } from '@/use-cases/options/options'

export interface FindManyByUserIdOptions
  extends Pick<Options, 'page' | 'date'> {}
interface TransactionWithAccount {
  id: Transaction['id']
  title: Transaction['title']
  description: Transaction['description']
  amount: Transaction['amount']
  type: Transaction['type']
  date: Transaction['date']
  isPaid: Transaction['is_paid']
  account: {
    id: Account['id']
    name: Account['name']
    institution: Account['institution']
  }
  category: {
    id: Category['id']
    name: Category['name']
    color: Category['color']
  }
}

export interface Balance {
  balance: number
  incomes: number
  expenses: number
}

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>
  findManyByAccountId(accountId: string): Promise<TransactionWithAccount[]>
  findManyByUserId(
    userId: string,
    options?: FindManyByUserIdOptions,
  ): Promise<TransactionWithAccount[]>
  findFiveLatestByUserId(userId: string): Promise<TransactionWithAccount[]>
  findBalanceByUserId(userId: string): Promise<Balance>
  create(
    transaction: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction>
  createMany(
    transactions: Prisma.TransactionUncheckedCreateInput[],
  ): Promise<{ createdCount: number }>
  delete(id: string): Promise<void>
  getGraphicsWeek(userId: string): Promise<Balance[]>
  getGraphicsMonth(userId: string): Promise<Balance[]>
  getGraphicsYear(userId: string): Promise<Balance[]>
  markAsPaid(id: string): Promise<void>
}
