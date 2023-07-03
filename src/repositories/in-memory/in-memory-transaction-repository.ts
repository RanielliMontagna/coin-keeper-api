import { randomUUID } from 'node:crypto'

import {
  TransactionType,
  type Prisma,
  type Transaction,
  Account,
} from '@prisma/client'
import type { TransactionRepository } from '../transaction-repository'

export class InMemoryTransactionRepository implements TransactionRepository {
  public transactions: Transaction[] = []
  public accounts: Account[] = []

  async findById(id: string) {
    const transaction = this.transactions.find((t) => t.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findManyByAccountId(accountId: string) {
    return this.transactions.filter((t) => t.account_id === accountId)
  }

  async findManyByUserId(accountId: string) {
    const transactions = this.transactions.filter(
      (t) => t.user_id === accountId,
    )

    return transactions.map((t) => ({
      ...t,
      account: {
        id: t.account_id,
        name: 'Account Name',
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: 1,
      },
    }))
  }

  async findFiveLatestByUserId(userId: string) {
    const transactions = this.transactions.filter((t) => t.user_id === userId)
    const latestTransactions = transactions.slice(-5)

    return latestTransactions.map((t) => ({
      ...t,
      account: {
        id: t.account_id,
        name: 'Account Name',
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: 1,
      },
    }))
  }

  async findBalanceByUserId(userId: string) {
    const accounts = this.accounts.filter((a) => a.user_id === userId)

    const balance = accounts.reduce((acc, account) => acc + account.balance, 0)
    const expenses = accounts.reduce((acc, account) => acc + account.expense, 0)
    const incomes = accounts.reduce((acc, account) => acc + account.income, 0)

    return { balance, expenses, incomes }
  }

  async create(transaction: Prisma.TransactionUncheckedCreateInput) {
    const account = this.accounts.find((a) => a.id === transaction.account_id)

    if (!account) {
      this.accounts.push({
        id: transaction.account_id,
        name: 'Account Name',
        user_id: transaction.user_id,
        balance: 0,
        income: 0,
        expense: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const newTransaction: Transaction = {
      id: transaction.id || randomUUID(),
      title: transaction.title,
      description: transaction.description || null,
      amount: transaction.amount,
      type: transaction.type,
      date: new Date(transaction.date),
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      user_id: transaction.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.transactions.push(newTransaction)

    const accountIndex = this.accounts.findIndex(
      (a) => a.id === transaction.account_id,
    )

    if (transaction.type === TransactionType.INCOME) {
      this.accounts[accountIndex].income += transaction.amount
      this.accounts[accountIndex].balance += transaction.amount
    } else {
      this.accounts[accountIndex].expense += transaction.amount
      this.accounts[accountIndex].balance -= transaction.amount
    }

    return newTransaction
  }

  async delete(id: string) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id)
    const transaction = this.transactions[transactionIndex]

    this.transactions.splice(transactionIndex, 1)

    const accountIndex = this.accounts.findIndex(
      (a) => a.id === transaction.account_id,
    )

    if (transaction.type === TransactionType.INCOME) {
      this.accounts[accountIndex].income -= transaction.amount
      this.accounts[accountIndex].balance -= transaction.amount
    } else {
      this.accounts[accountIndex].expense -= transaction.amount
      this.accounts[accountIndex].balance += transaction.amount
    }

    return transaction
  }
}
