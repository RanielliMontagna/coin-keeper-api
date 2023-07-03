import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'

interface GetTransactionsBalanceUseCaseRequest {
  userId: string
}

interface GetTransactionsBalanceUseCaseResponse {
  balance: number
  incomes: number
  expenses: number
}

export class GetTransactionsBalanceUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: GetTransactionsBalanceUseCaseRequest): Promise<GetTransactionsBalanceUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const balance = await this.transactionRepository.findBalanceByUserId(userId)

    return {
      balance: balance.balance,
      incomes: balance.incomes,
      expenses: balance.expenses,
    }
  }
}
