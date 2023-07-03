import { FetchTransactionsByUserUseCase } from '@/use-cases/transactions/fetch-transactions-by-user'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeFetchTransactionsByUserUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchTransactionsByUserUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
