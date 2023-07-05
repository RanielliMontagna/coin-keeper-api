import { GetTransactionsGraphicsMonthUseCase } from '@/use-cases/transactions/get-transactions-graphics-month'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetTransactionsGraphicsMonthUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetTransactionsGraphicsMonthUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
