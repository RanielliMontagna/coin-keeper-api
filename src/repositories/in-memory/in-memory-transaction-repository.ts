import { randomUUID } from 'node:crypto'

import {
  TransactionType,
  type Prisma,
  type Transaction,
  Account,
} from '@prisma/client'
import type { Balance, TransactionRepository } from '../transaction-repository'

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

  async getGraphicsWeek(userId: string) {
    const day = new Date().getDay()

    const transactions = this.transactions
      .filter((t) => t.user_id === userId)
      .filter((t) => {
        const today = new Date().getDay()
        const transactionDay = new Date(t.date).getDay()

        return today - transactionDay <= 7
      })

    const week = new Array(7).fill({
      balance: 0,
      expenses: 0,
      incomes: 0,
    }) as Balance[]

    for (let i = 0; i < 7; i++) {
      const date = new Date(new Date().setDate(new Date().getDate() - day + i))

      const incomes = transactions
        .filter(
          (t) =>
            t.type === TransactionType.INCOME &&
            t.date.getDate() === date.getDate(),
        )
        .reduce((acc, t) => acc + t.amount, 0)

      const expenses = transactions
        .filter(
          (t) =>
            t.type === TransactionType.EXPENSE &&
            t.date.getDate() === date.getDate(),
        )
        .reduce((acc, t) => acc + t.amount, 0)

      week[i] = {
        balance: incomes - expenses,
        expenses,
        incomes,
      }
    }

    return week
  }

  async getGraphicsMonth(userId: string) {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate()

    const transactions = this.transactions
      .filter((t) => t.user_id === userId)
      .filter((t) => {
        const month = new Date().getMonth()
        const transactionMonth = new Date(t.date).getMonth()

        return month - transactionMonth <= 1
      })

    const balance: Balance[] = new Array(daysInMonth).fill({
      balance: 0,
      incomes: 0,
      expenses: 0,
    })

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(new Date().setDate(i + 1))
      const day = date.getDate()

      const incomes = transactions
        .filter(
          (t) => t.type === TransactionType.INCOME && t.date.getDate() === day,
        )
        .reduce((acc, t) => acc + t.amount, 0)

      const expenses = transactions
        .filter(
          (t) => t.type === TransactionType.EXPENSE && t.date.getDate() === day,
        )
        .reduce((acc, t) => acc + t.amount, 0)

      balance[i] = { balance: incomes - expenses, incomes, expenses }
    }

    return balance
  }

  async getGraphicsYear(userId: string) {
    const year = new Date().getFullYear()

    const transactions = this.transactions
      .filter((t) => t.user_id === userId)
      .filter((t) => {
        const transactionYear = new Date(t.date).getFullYear()

        return year - transactionYear <= 1
      })

    const balance = new Array(12).fill({
      balance: 0,
      expenses: 0,
      incomes: 0,
    }) as Balance[]

    for (let i = 0; i < 12; i++) {
      const date = new Date(new Date().setMonth(new Date().getMonth() - i))
      const month = date.getMonth()

      const incomes = transactions.filter(
        (t) => t.type === TransactionType.INCOME && t.date.getMonth() === month,
      )

      const expenses = transactions.filter(
        (t) =>
          t.type === TransactionType.EXPENSE && t.date.getMonth() === month,
      )

      const incomesAmount = incomes.reduce((acc, t) => acc + t.amount, 0)
      const expensesAmount = expenses.reduce((acc, t) => acc + t.amount, 0)

      balance[month] = {
        balance: incomesAmount - expensesAmount,
        incomes: incomesAmount,
        expenses: expensesAmount,
      }
    }

    return balance
  }
}
