import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.utc().format()

import { RecurringTransaction, Transaction, Prisma } from '@prisma/client'

import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { RecurringTransactionNotFoundError } from '../errors/recurring-transaction-not-found-error'
import { FrequencyEnum } from './create-recurring-transaction'
import { WeeklyRecurringTransactionsError } from '../errors/weekly-recurring-transactions-error'
import { MonthlyRecurringTransactionsError } from '../errors/monthly-recurring-transactions-error'
import { YearlyRecurringTransactionsError } from '../errors/yearly-recurring-transactions-error'
import { TransactionRepository } from '@/repositories/transaction-repository'

interface GenerateTransactionsUseCaseRequest {
  recurringTransactionId: string
}

interface GenerateTransactionsUseCaseResponse {
  createdCount?: number
}

export class GenerateTransactions {
  constructor(
    private recurringTransactionRepository: RecurringTransactionRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute({
    recurringTransactionId,
  }: GenerateTransactionsUseCaseRequest): Promise<GenerateTransactionsUseCaseResponse> {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(recurringTransactionId)

    if (!recurringTransaction) {
      throw new RecurringTransactionNotFoundError()
    }

    return this.generateTransactions(recurringTransaction)
  }

  private async generateTransactions(
    recurringTransaction: RecurringTransaction,
  ) {
    const transactions: Prisma.TransactionCreateManyInput[] = []

    const repeatAmount = recurringTransaction.repeat_amount
    const startDate = dayjs(recurringTransaction.start_date).utc()
    let amountToBeDistributed = recurringTransaction.amount

    switch (recurringTransaction.frequency) {
      case FrequencyEnum.WEEKLY:
        // If the difference between the start and end date is less than 1 weeks, throw an error
        if (repeatAmount <= 1) throw new WeeklyRecurringTransactionsError()

        for (let i = 0; i < repeatAmount; i++) {
          const firstTransactionIsPaid = i === 0 && dayjs().isAfter(startDate)

          transactions.push({
            title: `${recurringTransaction.title} - ${i + 1} / ${repeatAmount}`,
            description: recurringTransaction.description,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type,
            account_id: recurringTransaction.account_id,
            category_id: recurringTransaction.category_id,
            user_id: recurringTransaction.user_id,
            date: dayjs(startDate).add(i, 'week').utc().toDate(),
            is_paid: firstTransactionIsPaid,
          })
        }

        break
      case FrequencyEnum.MONTHLY:
        // If the difference between the start and end date is less than 1 months, throw an error
        if (repeatAmount <= 1) throw new MonthlyRecurringTransactionsError()

        for (let i = 0; i < repeatAmount; i++) {
          const firstTransactionIsPaid = i === 0 && dayjs().isAfter(startDate)

          transactions.push({
            title: `${recurringTransaction.title} - ${i + 1} / ${repeatAmount}`,
            description: recurringTransaction.description,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type,
            account_id: recurringTransaction.account_id,
            category_id: recurringTransaction.category_id,
            user_id: recurringTransaction.user_id,
            date: dayjs(startDate).add(i, 'month').utc().toDate(),
            is_paid: firstTransactionIsPaid,
          })
        }

        break
      case FrequencyEnum.YEARLY:
        // If the difference between the start and end date is less than 1 years, throw an error
        if (repeatAmount <= 1) throw new YearlyRecurringTransactionsError()

        for (let i = 0; i < repeatAmount; i++) {
          transactions.push({
            title: `${recurringTransaction.title} - ${i + 1} / ${repeatAmount}`,
            description: recurringTransaction.description,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type,
            account_id: recurringTransaction.account_id,
            category_id: recurringTransaction.category_id,
            user_id: recurringTransaction.user_id,
            date: dayjs(startDate).add(i, 'year').utc().toDate(),
            is_paid: i === 0 && dayjs().isAfter(startDate),
          })
        }

        break
    }

    const createdTransactions = await this.transactionRepository.createMany(
      transactions,
    )

    return { createdCount: createdTransactions.createdCount }
  }
}
