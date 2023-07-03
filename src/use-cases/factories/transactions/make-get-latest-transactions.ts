import { GetLatestTransactionsByUserUseCase } from '@/use-cases/transactions/get-latest-transactions'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetLatestTransactionsUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetLatestTransactionsByUserUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
