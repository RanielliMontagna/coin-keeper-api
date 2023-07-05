import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'

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
    //TODO - Implementar lógica para retornar os dados da semana

    return {
      month: new Array(30).fill(0).map((_, index) => ({
        balance: 1000 + index * 100,
        incomes: 500 + index * 100,
        expenses: 200 + index * 100,
      })),
    }
  }
}
