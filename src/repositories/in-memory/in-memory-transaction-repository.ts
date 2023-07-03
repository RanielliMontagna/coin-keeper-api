import { randomUUID } from 'node:crypto'

import type { Prisma, Transaction } from '@prisma/client'
import type { TransactionRepository } from '../transaction-repository'

export class InMemoryTransactionRepository implements TransactionRepository {
  public transactions: Transaction[] = []

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
    const transactions = this.transactions
      .filter((t) => t.user_id === userId)
      .slice(0, 5)

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

  async create(transaction: Prisma.TransactionUncheckedCreateInput) {
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

    return newTransaction
  }

  async delete(id: string) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id)

    const transaction = this.transactions[transactionIndex]

    this.transactions.splice(transactionIndex, 1)

    return transaction
  }
}
