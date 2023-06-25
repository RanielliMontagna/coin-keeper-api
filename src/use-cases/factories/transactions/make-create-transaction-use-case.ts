import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

import { CreateTransactionUseCase } from '@/use-cases/transactions/create-transaction'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'

export function makeCreateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new CreateTransactionUseCase(
    transactionRepository,
    accountRepository,
  )

  return useCase
}
