import { DeleteTransactionUseCase } from '@/use-cases/transactions/delete-transaction'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeDeleteTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new DeleteTransactionUseCase(
    transactionRepository,
    accountRepository,
  )
  return useCase
}
