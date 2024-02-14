import { RecurringTransaction } from '@prisma/client'

import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { Options } from '../options/options'

interface FetchRecurringTransactionsByUserUseCaseRequest {
  userId: string
  options?: Pick<Options, 'page' | 'all'>
}

interface FetchRecurringTransactionsByUserUseCaseResponse {
  recurringTransactions: {
    id: RecurringTransaction['id']
    title: RecurringTransaction['title']
    description: RecurringTransaction['description']
    amount: RecurringTransaction['amount']
    type: RecurringTransaction['type']
    frequency: RecurringTransaction['frequency']
    startDate: RecurringTransaction['start_date']
    endDate: RecurringTransaction['end_date']
  }[]
}

export class FetchRecurringTransactionsByUserUseCase {
  constructor(
    private RecurringtransactionRepository: RecurringTransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    options,
  }: FetchRecurringTransactionsByUserUseCaseRequest): Promise<FetchRecurringTransactionsByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const recurringTransactions =
      await this.RecurringtransactionRepository.findManyByUserId(
        userId,
        options,
      )

    return {
      recurringTransactions: recurringTransactions.map(
        (recurringTransaction) => ({
          id: recurringTransaction.id,
          title: recurringTransaction.title,
          description: recurringTransaction.description,
          amount: recurringTransaction.amount,
          type: recurringTransaction.type,
          frequency: recurringTransaction.frequency,
          startDate: recurringTransaction.start_date,
          endDate: recurringTransaction.end_date,
        }),
      ),
    }
  }
}
