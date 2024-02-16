import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

import { CreateRecurringTransactionUseCase } from '@/use-cases/recurring-transactions/create-recurring-transaction'
import { PrismaRecurringTransactionRepository } from '@/repositories/prisma/prisma-recurring-transaction-repository'

export function makeCreateRecurringTransactionUseCase() {
  const RecurringtransactionRepository =
    new PrismaRecurringTransactionRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new CreateRecurringTransactionUseCase(
    RecurringtransactionRepository,
    accountRepository,
  )

  return useCase
}
