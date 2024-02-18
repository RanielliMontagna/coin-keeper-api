import { RecurringTransaction, Transaction } from '@prisma/client'

import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { RecurringTransactionNotFoundError } from '../errors/recurring-transaction-not-found-error'
import { FrequencyEnum } from './create-recurring-transaction'
import { WeeklyRecurringTransactionsError } from '../errors/weekly-recurring-transactions-error'
import { MonthlyRecurringTransactionsError } from '../errors/monthly-recurring-transactions-error'
import { YearlyRecurringTransactionsError } from '../errors/yearly-recurring-transactions-error'

interface GenerateTransactionsUseCaseRequest {
  recurringTransactionId: string
}

interface GenerateTransactionsUseCaseResponse {
  transactions: Transaction[]
}

export class GenerateTransactions {
  constructor(
    private recurringTransactionRepository: RecurringTransactionRepository,
  ) {}

  async execute({
    recurringTransactionId,
  }: GenerateTransactionsUseCaseRequest): Promise<GenerateTransactionsUseCaseResponse> {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(recurringTransactionId)

    if (!recurringTransaction) {
      throw new RecurringTransactionNotFoundError()
    }

    if (recurringTransaction.end_date) {
      return this.generateTransactionsWithEndDate(recurringTransaction)
    }

    return this.generateTransactionsWithoutEndDate(recurringTransaction)
  }

  private async generateTransactionsWithEndDate(
    recurringTransaction: RecurringTransaction,
  ) {
    const transactions: Transaction[] = []

    const startDate = new Date(recurringTransaction.start_date)
    const endDate = new Date(recurringTransaction.end_date!)

    console.log(startDate)
    console.log(endDate)

    switch (recurringTransaction.frequency) {
      case FrequencyEnum.WEEKLY:
        const weeks = Math.floor(
          (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
        )

        // If the difference between the start and end date is less than 1 weeks, throw an error
        if (weeks <= 0) throw new WeeklyRecurringTransactionsError()

        console.log(weeks)

        break
      case FrequencyEnum.MONTHLY:
        const months = Math.floor(
          (endDate.getTime() - startDate.getTime()) /
            (30 * 24 * 60 * 60 * 1000),
        )

        // If the difference between the start and end date is less than 1 months, throw an error
        if (months <= 0) throw new MonthlyRecurringTransactionsError()

        console.log(months)

        break
      case FrequencyEnum.YEARLY:
        const years = Math.floor(
          (endDate.getTime() - startDate.getTime()) /
            (365 * 24 * 60 * 60 * 1000),
        )

        // If the difference between the start and end date is less than 1 years, throw an error
        if (years <= 0) throw new YearlyRecurringTransactionsError()

        console.log(years)

        break
    }

    return { transactions }
  }

  private async generateTransactionsWithoutEndDate(
    recurringTransaction: RecurringTransaction,
  ) {
    const transactions: Transaction[] = []

    //TODO: Implement logic to generate transactions without end date

    return { transactions }
  }
}
