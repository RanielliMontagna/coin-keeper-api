import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { Options } from '../options/options'

interface FetchTransactionsByUserUseCaseRequest {
  userId: string
  options?: Pick<Options, 'page' | 'date'>
}

interface FetchTransactionsByUserUseCaseResponse {
  transactions: {
    id: Transaction['id']
    title: Transaction['title']
    description: Transaction['description']
    amount: Transaction['amount']
    type: Transaction['type']
    date: Transaction['date']
  }[]
}

export class FetchTransactionsByUserUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    options,
  }: FetchTransactionsByUserUseCaseRequest): Promise<FetchTransactionsByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions = await this.transactionRepository.findManyByUserId(
      userId,
      options,
    )

    return { transactions }
  }
}
