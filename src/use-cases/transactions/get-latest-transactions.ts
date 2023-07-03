import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetLatestTransactionsByUserUseCaseRequest {
  userId: string
}

interface GetLatestTransactionsByUserUseCaseResponse {
  transactions: {
    id: Transaction['id']
    title: Transaction['title']
    description: Transaction['description']
    amount: Transaction['amount']
    type: Transaction['type']
    date: Transaction['date']
  }[]
}

export class GetLatestTransactionsByUserUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: GetLatestTransactionsByUserUseCaseRequest): Promise<GetLatestTransactionsByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions =
      await this.transactionRepository.findFiveLatestByUserId(userId)

    return { transactions }
  }
}
