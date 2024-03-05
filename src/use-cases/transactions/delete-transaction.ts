import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountRepository } from '@/repositories/account-repository'

import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

import { TransactionEnum } from './create-transaction'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
}

export class DeleteTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({ transactionId }: DeleteTransactionUseCaseRequest) {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    await this.transactionRepository.delete(transactionId)

    if (transaction.is_paid) {
      await this.accountRepository.updateBalance({
        accountId: transaction.account_id,
        userId: transaction.user_id,
        expense:
          transaction.type === TransactionEnum.EXPENSE
            ? -transaction.amount
            : 0,
        income:
          transaction.type === TransactionEnum.INCOME ? -transaction.amount : 0,
      })
    }
  }
}
