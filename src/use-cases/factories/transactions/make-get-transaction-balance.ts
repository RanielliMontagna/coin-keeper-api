import { GetTransactionsBalanceUseCase } from '@/use-cases/transactions/get-transactions-balance'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetTransactionsBalanceUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetTransactionsBalanceUseCase(
    transactionRepository,
    userRepository,
  )

  return useCase
}
