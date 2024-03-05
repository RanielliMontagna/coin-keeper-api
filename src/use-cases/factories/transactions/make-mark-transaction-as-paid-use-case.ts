import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { MarkTransactionAsPaidUseCase } from '@/use-cases/transactions/mark-transaction-as-paid'

export function makeMarkTransactionAsPaidUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new MarkTransactionAsPaidUseCase(
    transactionRepository,
    accountRepository,
  )

  return useCase
}
