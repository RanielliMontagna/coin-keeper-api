import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { Options } from '../options/options'
import { TransactionEnum } from './create-transaction'

interface FetchTransactionsByUserUseCaseRequest {
  userId: string
  options?: Pick<Options, 'page' | 'date'>
}

interface FetchTransactionsByUserUseCaseResponse {
  transactions: {
    id: Transaction['id']
    title: Transaction['title']
    description: Transaction['description']
    isPaid: Transaction['is_paid']
    amount: Transaction['amount']
    type: Transaction['type']
    date: Transaction['date']
  }[]
  monthlyBalance: {
    balance: number
    incomes: number
    expenses: number
  }
}

export class FetchTransactionsByUserUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    options,
  }: FetchTransactionsByUserUseCaseRequest): Promise<FetchTransactionsByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions = await this.transactionRepository.findManyByUserId(
      userId,
      options,
    )

    const expenseAmount = transactions
      .filter((transaction) => transaction.type === TransactionEnum.EXPENSE)
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    const incomeAmount = transactions
      .filter((transaction) => transaction.type === TransactionEnum.INCOME)
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    const monthlyBalance = {
      balance: incomeAmount - expenseAmount,
      incomes: incomeAmount,
      expenses: expenseAmount,
    }

    return { transactions, monthlyBalance }
  }
}
