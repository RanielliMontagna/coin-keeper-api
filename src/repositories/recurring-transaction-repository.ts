import { Account, Category, Prisma, RecurringTransaction } from '@prisma/client'
import { Options } from '@/use-cases/options/options'

export interface FindManyByUserIdOptions extends Pick<Options, 'page'> {}

interface RecurringTransactionWithAccount {
  id: RecurringTransaction['id']
  title: RecurringTransaction['title']
  description: RecurringTransaction['description']
  amount: RecurringTransaction['amount']
  type: RecurringTransaction['type']
  frequency: RecurringTransaction['frequency']
  start_date: RecurringTransaction['start_date']
  end_date: RecurringTransaction['end_date']
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

export interface RecurringTransactionRepository {
  findById(id: string): Promise<RecurringTransaction | null>
  findManyByUserId(
    userId: string,
    options?: FindManyByUserIdOptions,
  ): Promise<RecurringTransactionWithAccount[]>
  create(
    recurringTransaction: Prisma.RecurringTransactionUncheckedCreateInput,
  ): Promise<RecurringTransaction>
  delete(id: string): Promise<void>
}
