import { Account, Prisma, RecurringTransaction } from '@prisma/client'
import {
  FindManyByUserIdOptions,
  RecurringTransactionRepository,
} from '../recurring-transaction-repository'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'
import { FrequencyEnum } from '@/use-cases/recurring-transactions/create-recurring-transaction'
import { ColorEnum } from '@/use-cases/categories/create-category'

export class InMemoryRecurringTransactionRepository
  implements RecurringTransactionRepository
{
  public recurringTransactions: RecurringTransaction[] = []
  public accounts: Account[] = []

  async findById(id: string) {
    const recurringTransaction = this.recurringTransactions.find(
      (t) => t.id === id,
    )

    if (!recurringTransaction) {
      return null
    }

    if (recurringTransaction.deleted_at) {
      return null
    }

    return recurringTransaction
  }

  async findManyByUserId(userId: string, options?: FindManyByUserIdOptions) {
    const { page = 1, all } = options || {}

    const recurringTransactions = this.recurringTransactions.filter((t) => {
      if (t.deleted_at) return false
      if (t.user_id === userId) return true
    })

    const transactionsPerPage = 15

    const start = (page - 1) * transactionsPerPage
    const end = start + transactionsPerPage

    const recurringTransactionsToReturn = all
      ? recurringTransactions
      : recurringTransactions.slice(start, end)

    return recurringTransactionsToReturn.map((t) => ({
      ...t,
      account: {
        id: t.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: ColorEnum.BLUE,
      },
    }))
  }

  async create(
    recurringTransaction: Prisma.RecurringTransactionUncheckedCreateInput,
  ): Promise<RecurringTransaction> {
    const account = this.accounts.find(
      (a) => a.id === recurringTransaction.account_id,
    )

    if (!account) {
      this.accounts.push({
        id: recurringTransaction.account_id,
        name: 'Account Name',
        user_id: recurringTransaction.user_id,
        institution: InstitutionEnum.OTHER,
        balance: 0,
        income: 0,
        expense: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      })
    }

    const newRecurringTransaction: RecurringTransaction = {
      id: recurringTransaction.id || '1',
      title: recurringTransaction.title,
      description: recurringTransaction.description || null,
      amount: recurringTransaction.amount,
      type: recurringTransaction.type as TransactionEnum,
      frequency: recurringTransaction.frequency as FrequencyEnum,
      start_date: new Date(recurringTransaction.start_date),
      repeat_amount: recurringTransaction.repeat_amount,
      account_id: recurringTransaction.account_id,
      category_id: recurringTransaction.category_id,
      user_id: recurringTransaction.user_id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.recurringTransactions.push(newRecurringTransaction)

    return newRecurringTransaction
  }

  async delete(id: string) {
    const recurringTransactionIndex = this.recurringTransactions.findIndex(
      (t) => t.id === id,
    )
    const recurringTransaction =
      this.recurringTransactions[recurringTransactionIndex]

    this.recurringTransactions[recurringTransactionIndex] = {
      ...recurringTransaction,
      deleted_at: new Date(),
    }
  }
}
