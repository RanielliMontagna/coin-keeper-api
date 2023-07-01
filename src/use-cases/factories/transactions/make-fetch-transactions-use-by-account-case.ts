import { FetchTransactionsByAccountUseCase } from '@/use-cases/transactions/fetch-transactions-by-account'

import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeFetchTransactionsByAccountUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new FetchTransactionsByAccountUseCase(
    transactionRepository,
    accountRepository,
  )

  return useCase
}
