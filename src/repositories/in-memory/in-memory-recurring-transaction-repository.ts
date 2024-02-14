import { Account, Prisma, RecurringTransaction } from '@prisma/client'
import { RecurringTransactionRepository } from '../recurring-transaction-repository'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'
import { FrequencyEnum } from '@/use-cases/recurring-transactions/create-recurring-transaction'

export class InMemoryRecurringTransactionRepository
  implements RecurringTransactionRepository
{
  public recurringTransactions: RecurringTransaction[] = []
  public accounts: Account[] = []

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
      end_date: recurringTransaction.end_date
        ? new Date(recurringTransaction.end_date)
        : null,
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
}
