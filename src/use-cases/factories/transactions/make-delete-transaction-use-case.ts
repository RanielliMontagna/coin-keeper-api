import { DeleteTransactionUseCase } from '@/use-cases/transactions/delete-transaction'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'

export function makeDeleteTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository()

  const useCase = new DeleteTransactionUseCase(transactionRepository)

  return useCase
}
