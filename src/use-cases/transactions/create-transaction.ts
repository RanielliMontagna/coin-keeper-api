import { Transaction } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { TransactionRepository } from '@/repositories/transaction-repository'
import { AccountNotFoundError } from '../errors/account-not-found-error'

export enum TransactionEnum {
  INCOME = 0,
  EXPENSE = 1,
}

export interface CreateTransactionUseCaseRequest {
  title: string
  description?: string
  amount: number
  type: TransactionEnum
  date: Date
  isPaid?: boolean
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
    isPaid = true,
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
      is_paid: isPaid,
      account_id: accountId,
      category_id: categoryId,
      user_id: userId,
    })

    if (isPaid) {
      await this.accountRepository.updateBalance({
        accountId,
        userId,
        expense: type === TransactionEnum.EXPENSE ? amount : 0,
        income: type === TransactionEnum.INCOME ? amount : 0,
      })
    }

    return { transaction }
  }
}
