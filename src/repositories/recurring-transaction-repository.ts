import { Prisma, RecurringTransaction } from '@prisma/client'

export interface RecurringTransactionRepository {
  create(
    recurringTransaction: Prisma.RecurringTransactionUncheckedCreateInput,
  ): Promise<RecurringTransaction>
}
