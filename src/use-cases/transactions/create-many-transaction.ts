import { Prisma, Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountRepository } from '@/repositories/account-repository'
import { TransactionEnum } from './create-transaction'

interface CreateManyTransactionUseCaseRequest {
  transactions: Prisma.TransactionUncheckedCreateInput[]
}

interface CreateManyTransactionUseCaseResponse {
  createdCount: number
}

export class CreateManyTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    transactions,
  }: CreateManyTransactionUseCaseRequest): Promise<CreateManyTransactionUseCaseResponse> {
    const { createdCount } = await this.transactionRepository.createMany(
      transactions,
    )

    for (const transaction of transactions) {
      const transactionIsPaid = transaction.is_paid

      if (transactionIsPaid) {
        const account = await this.accountRepository.findById(
          transaction.account_id,
        )

        if (account) {
          await this.accountRepository.updateBalance({
            accountId: transaction.account_id,
            userId: transaction.user_id,
            expense:
              transaction.type === TransactionEnum.EXPENSE
                ? transaction.amount
                : 0,
            income:
              transaction.type === TransactionEnum.INCOME
                ? transaction.amount
                : 0,
          })
        }
      }
    }

    return { createdCount }
  }
}
