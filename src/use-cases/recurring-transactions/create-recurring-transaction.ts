import { RecurringTransaction } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

import { TransactionEnum } from '../transactions/create-transaction'
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
  repeatAmount: number
}

interface CreateRecurringTransactionUseCaseResponse {
  recurringTransaction: RecurringTransaction
}

export class CreateRecurringTransactionUseCase {
  constructor(
    private recurringTransactionRepository: RecurringTransactionRepository,
    private transactionRepository: TransactionRepository,
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
    repeatAmount,
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
        repeat_amount: repeatAmount,
        account_id: accountId,
        category_id: categoryId,
        user_id: userId,
      })

    //Generate transactions
    const generateTransactions = new GenerateTransactions(
      this.recurringTransactionRepository,
      this.transactionRepository,
    )

    await generateTransactions.execute({
      recurringTransactionId: recurringTransaction.id,
    })

    return {
      recurringTransaction,
    }
  }
}
