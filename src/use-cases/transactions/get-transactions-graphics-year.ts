import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'

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
    //TODO - Implementar lógica para retornar os dados da semana

    return {
      year: new Array(12).fill(0).map((_, index) => ({
        balance: 1000 + index * 100,
        incomes: 500 + index * 100,
        expenses: 200 + index * 100,
      })),
    }
  }
}
