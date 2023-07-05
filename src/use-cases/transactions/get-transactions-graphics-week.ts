import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetTransactionsGraphicsWeekUseCaseRequest {
  userId: string
}

interface GetTransactionsGraphicsWeekUseCaseResponse {
  week: {
    balance: number
    incomes: number
    expenses: number
  }[]
}

export class GetTransactionsGraphicsWeekUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: GetTransactionsGraphicsWeekUseCaseRequest): Promise<GetTransactionsGraphicsWeekUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const week = await this.transactionRepository.getGraphicsWeek(userId)

    return { week }
  }
}
