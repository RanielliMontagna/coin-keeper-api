import { RecurringTransaction } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { TransactionEnum } from '../transactions/create-transaction'
import { AccountNotFoundError } from '../errors/account-not-found-error'
import { GenerateTransactions } from './generate-transactions'

export enum FrequencyEnum {
  WEEKLY = 0,
  MONTHLY = 1,
  YEARLY = 2,
}

interface CreateRecurringTransactionUseCaseRequest {
  title: string
  description?: string
  amount: number
  type: TransactionEnum
  accountId: string
  categoryId: string
  userId: string
  frequency: FrequencyEnum
  startDate: Date
  endDate?: Date
}

interface CreateRecurringTransactionUseCaseResponse {
  recurringTransaction: RecurringTransaction
}

export class CreateRecurringTransactionUseCase {
  constructor(
    private recurringTransactionRepository: RecurringTransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    title,
    description,
    amount,
    type,
    accountId,
    categoryId,
    userId,
    frequency,
    startDate,
    endDate,
  }: CreateRecurringTransactionUseCaseRequest): Promise<CreateRecurringTransactionUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const recurringTransaction =
      await this.recurringTransactionRepository.create({
        title,
        description,
        amount,
        type,
        frequency,
        start_date: startDate,
        end_date: endDate,
        account_id: accountId,
        category_id: categoryId,
        user_id: userId,
      })

    //Generate transactions
    const generateTransactions = new GenerateTransactions(
      this.recurringTransactionRepository,
    )

    await generateTransactions.execute({
      recurringTransactionId: recurringTransaction.id,
    })

    return {
      recurringTransaction,
    }
  }
}
