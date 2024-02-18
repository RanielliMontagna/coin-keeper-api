import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

import { CreateRecurringTransactionUseCase } from '@/use-cases/recurring-transactions/create-recurring-transaction'
import { PrismaRecurringTransactionRepository } from '@/repositories/prisma/prisma-recurring-transaction-repository'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'

export function makeCreateRecurringTransactionUseCase() {
  const recurringtransactionRepository =
    new PrismaRecurringTransactionRepository()
  const transactionRepository = new PrismaTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new CreateRecurringTransactionUseCase(
    recurringtransactionRepository,
    transactionRepository,
    accountRepository,
  )

  return useCase
}
