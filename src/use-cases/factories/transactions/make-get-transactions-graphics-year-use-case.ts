import { GetTransactionsGraphicsYearUseCase } from '@/use-cases/transactions/get-transactions-graphics-year'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetTransactionsGraphicsYearUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetTransactionsGraphicsYearUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
