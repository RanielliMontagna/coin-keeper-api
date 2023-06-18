import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountRepository } from '@/repositories/account-repository'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

interface FetchTransactionsUseCaseRequest {
  accountId: string
}

interface FetchTransactionsUseCaseResponse {
  transactions: Transaction[]
}

export class FetchTransactionsUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    accountId,
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const transactions = await this.transactionRepository.findManyByAccountId(
      accountId,
    )

    return { transactions }
  }
}
