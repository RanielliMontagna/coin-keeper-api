import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetTransactionsGraphicsMonthUseCaseRequest {
  userId: string
}

interface GetTransactionsGraphicsMonthUseCaseResponse {
  month: {
    balance: number
    incomes: number
    expenses: number
  }[]
}

export class GetTransactionsGraphicsMonthUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: GetTransactionsGraphicsMonthUseCaseRequest): Promise<GetTransactionsGraphicsMonthUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const month = await this.transactionRepository.getGraphicsMonth(userId)

    return { month }
  }
}
