import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetTransactionsGraphicsYearUseCaseRequest {
  userId: string
}

interface GetTransactionsGraphicsYearUseCaseResponse {
  year: {
    balance: number
    incomes: number
    expenses: number
  }[]
}

export class GetTransactionsGraphicsYearUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: GetTransactionsGraphicsYearUseCaseRequest): Promise<GetTransactionsGraphicsYearUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const year = await this.transactionRepository.getGraphicsYear(userId)

    return { year }
  }
}
