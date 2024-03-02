import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountRepository } from '@/repositories/account-repository'

import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'
import { TransactionEnum } from './create-transaction'

interface MarkTransactionAsPaidUseCaseRequest {
  transactionId: string
  userId: string
}

interface MarkTransactionAsPaidUseCaseResponse {
  id: string
  isPaid: boolean
}

export class MarkTransactionAsPaidUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    transactionId,
    userId,
  }: MarkTransactionAsPaidUseCaseRequest): Promise<MarkTransactionAsPaidUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    if (transaction.user_id !== userId) {
      throw new TransactionNotFoundError()
    }

    await this.transactionRepository.markAsPaid(transactionId)

    const account = await this.accountRepository.findById(
      transaction.account_id,
    )

    if (!account) {
      throw new AccountNotFoundError()
    }

    await this.accountRepository.updateBalance({
      accountId: account.id,
      userId,
      expense:
        transaction.type === TransactionEnum.EXPENSE ? transaction.amount : 0,
      income:
        transaction.type === TransactionEnum.INCOME ? transaction.amount : 0,
    })

    return { id: transactionId, isPaid: true }
  }
}
