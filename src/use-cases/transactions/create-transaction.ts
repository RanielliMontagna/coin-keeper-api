import { Transaction } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountNotFoundError } from '../errors/account-not-found-error'

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

interface CreateTransactionUseCaseRequest {
  title: string
  description?: string
  amount: number
  type: TransactionType
  date: Date
  accountId: string
  categoryId: string
  userId: string
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    title,
    description,
    amount,
    type,
    date,
    accountId,
    categoryId,
    userId,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const transaction = await this.transactionRepository.create({
      title,
      description,
      amount,
      type,
      date,
      account_id: accountId,
      category_id: categoryId,
      user_id: userId,
    })

    return {
      transaction,
    }
  }
}
