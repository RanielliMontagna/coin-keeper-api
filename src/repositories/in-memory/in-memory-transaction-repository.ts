import { randomUUID } from 'node:crypto'

import { Prisma, Transaction, Account } from '@prisma/client'

import type {
  Balance,
  FindManyByUserIdOptions,
  TransactionRepository,
} from '../transaction-repository'
import { ColorEnum } from '@/use-cases/categories/create-category'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'

export class InMemoryTransactionRepository implements TransactionRepository {
  public transactions: Transaction[] = []
  public accounts: Account[] = []

  async findById(id: string) {
    const transaction = this.transactions.find((t) => t.id === id)

    if (!transaction) {
      return null
    }

    if (transaction.deleted_at) {
      return null
    }

    return transaction
  }

  async findManyByAccountId(accountId: string) {
    const transactions = this.transactions.filter((t) => {
      if (t.deleted_at) return false
      if (t.account_id === accountId) return true
    })

    return transactions.map(({ is_paid, ...t }) => ({
      ...t,
      isPaid: is_paid,
      account: {
        id: t.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: ColorEnum.BLUE,
      },
    }))
  }

  async findManyByUserId(userId: string, options?: FindManyByUserIdOptions) {
    const { page = 1, date } = options || {}

    const transactions = this.transactions.filter((t) => {
      if (t.deleted_at) return false
      if (t.user_id === userId) return true
    })

    const filteredTransactions = date
      ? transactions.filter(
          (t) =>
            new Date(t.date).getMonth() === new Date(date).getMonth() &&
            new Date(t.date).getFullYear() === new Date(date).getFullYear(),
        )
      : transactions

    const transactionsPerPage = 15

    const start = (page - 1) * transactionsPerPage
    const end = start + transactionsPerPage

    return filteredTransactions.slice(start, end).map(({ is_paid, ...t }) => ({
      ...t,
      isPaid: is_paid,
      account: {
        id: t.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: ColorEnum.BLUE,
      },
    }))
  }

  async findFiveLatestByUserId(userId: string) {
    const transactions = this.transactions.filter((t) => {
      if (t.deleted_at) return false
      if (t.user_id === userId) return true
    })
    const latestTransactions = transactions.slice(-5)

    return latestTransactions.map(({ is_paid, ...t }) => ({
      ...t,
      isPaid: is_paid,
      account: {
        id: t.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
      category: {
        id: t.category_id,
        name: 'Category Name',
        color: ColorEnum.BLUE,
      },
    }))
  }

  async findBalanceByUserId(userId: string) {
    const accounts = this.accounts.filter((a) => {
      if (a.user_id === userId) return true
    })

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
        institution: InstitutionEnum.OTHER,
        balance: 0,
        income: 0,
        expense: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      })
    }

    const newTransaction: Transaction = {
      id: transaction.id || randomUUID(),
      title: transaction.title,
      description: transaction.description || null,
      amount: transaction.amount,
      type: transaction.type as TransactionEnum,
      date: new Date(transaction.date),
      is_paid: transaction.is_paid || false,
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      user_id: transaction.user_id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      recurring_transaction_id: transaction.recurring_transaction_id || null,
    }

    this.transactions.push(newTransaction)

    return newTransaction
  }

  async createMany(
    transactions: Prisma.TransactionUncheckedCreateInput[],
  ): Promise<{ createdCount: number }> {
    const newTransactions = transactions.map((transaction) => {
      const account = this.accounts.find((a) => a.id === transaction.account_id)

      if (!account) {
        this.accounts.push({
          id: transaction.account_id,
          name: 'Account Name',
          user_id: transaction.user_id,
          institution: InstitutionEnum.OTHER,
          balance: 0,
          income: 0,
          expense: 0,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        })
      }

      const newTransaction: Transaction = {
        id: transaction.id || randomUUID(),
        title: transaction.title,
        description: transaction.description || null,
        amount: transaction.amount,
        type: transaction.type as TransactionEnum,
        date: new Date(transaction.date),
        is_paid: transaction.is_paid || false,
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        user_id: transaction.user_id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        recurring_transaction_id: transaction.recurring_transaction_id || null,
      }

      return newTransaction
    })

    this.transactions.push(...newTransactions)

    return {
      createdCount: transactions.length,
    }
  }

  async delete(id: string) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id)
    const transaction = this.transactions[transactionIndex]

    this.transactions[transactionIndex] = {
      ...transaction,
      deleted_at: new Date(),
    }
  }

  async getGraphicsWeek(userId: string) {
    const day = new Date().getDay()

    const transactions = this.transactions
      .filter((t) => {
        if (t.deleted_at) return false
        if (t.user_id === userId) return true
      })
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
            t.type === TransactionEnum.INCOME &&
            t.date.getDate() === date.getDate(),
        )
        .reduce((acc, t) => acc + t.amount, 0)

      const expenses = transactions
        .filter(
          (t) =>
            t.type === TransactionEnum.EXPENSE &&
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
      .filter((t) => {
        if (t.deleted_at) return false
        if (t.user_id === userId) return true
      })
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
          (t) => t.type === TransactionEnum.INCOME && t.date.getDate() === day,
        )
        .reduce((acc, t) => acc + t.amount, 0)

      const expenses = transactions
        .filter(
          (t) => t.type === TransactionEnum.EXPENSE && t.date.getDate() === day,
        )
        .reduce((acc, t) => acc + t.amount, 0)

      balance[i] = { balance: incomes - expenses, incomes, expenses }
    }

    return balance
  }

  async getGraphicsYear(userId: string) {
    const year = new Date().getFullYear()

    const transactions = this.transactions
      .filter((t) => {
        if (t.deleted_at) return false
        if (t.user_id === userId) return true
      })
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
        (t) => t.type === TransactionEnum.INCOME && t.date.getMonth() === month,
      )

      const expenses = transactions.filter(
        (t) =>
          t.type === TransactionEnum.EXPENSE && t.date.getMonth() === month,
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

  async markAsPaid(id: string) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id)

    this.transactions[transactionIndex] = {
      ...this.transactions[transactionIndex],
      is_paid: true,
    }
  }
}
