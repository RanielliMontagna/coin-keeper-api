import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { MarkTransactionAsPaidUseCase } from '@/use-cases/transactions/mark-transaction-as-paid'

export function makeMarkTransactionAsPaidUseCase() {
  const transactionRepository = new PrismaTransactionRepository()

  const useCase = new MarkTransactionAsPaidUseCase(transactionRepository)

  return useCase
}
