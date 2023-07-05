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
    //TODO - Implementar lógica para retornar os dados da semana

    return {
      week: new Array(7).fill(0).map((_, index) => ({
        balance: 1000 + index * 100,
        incomes: 500 + index * 100,
        expenses: 200 + index * 100,
      })),
    }
  }
}
