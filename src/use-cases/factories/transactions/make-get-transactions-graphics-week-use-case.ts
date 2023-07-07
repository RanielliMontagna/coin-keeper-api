import { GetTransactionsGraphicsWeekUseCase } from '@/use-cases/transactions/get-transactions-graphics-week'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetTransactionsGraphicsWeekUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetTransactionsGraphicsWeekUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
