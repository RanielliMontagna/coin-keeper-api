import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountRepository } from '@/repositories/account-repository'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

interface FetchTransactionsByAccountUseCaseRequest {
  accountId: string
}

interface FetchTransactionsByAccountCaseResponse {
  transactions: {
    id: Transaction['id']
    title: Transaction['title']
    description: Transaction['description']
    amount: Transaction['amount']
    type: Transaction['type']
    date: Transaction['date']
  }[]
}

export class FetchTransactionsByAccountUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    accountId,
  }: FetchTransactionsByAccountUseCaseRequest): Promise<FetchTransactionsByAccountCaseResponse> {
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
