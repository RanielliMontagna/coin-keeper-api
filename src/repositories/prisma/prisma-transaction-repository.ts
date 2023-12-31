import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import {
  Balance,
  FindManyByUserIdOptions,
  TransactionRepository,
} from '../transaction-repository'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'

export class PrismaTransactionRepository implements TransactionRepository {
  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction) return null
    if (transaction.deleted_at) return null

    return transaction
  }

  async findManyByAccountId(accountId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { account_id: accountId, deleted_at: null },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        type: true,
        date: true,
        account: { select: { id: true, name: true, institution: true } },
        category: { select: { id: true, name: true, color: true } },
      },
    })

    return transactions
  }

  async findManyByUserId(userId: string, options?: FindManyByUserIdOptions) {
    const { page = 1 } = options || {}

    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId, deleted_at: null },
      take: 15,
      skip: (page - 1) * 15,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        type: true,
        date: true,
        account: { select: { id: true, name: true, institution: true } },
        category: { select: { id: true, name: true, color: true } },
      },
    })

    return transactions
  }

  async findFiveLatestByUserId(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId, deleted_at: null },
      take: 5,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        type: true,
        date: true,
        account: {
          select: {
            id: true,
            name: true,
            institution: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    return transactions
  }

  async findBalanceByUserId(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { user_id: userId, deleted_at: null },
      select: {
        balance: true,
        income: true,
        expense: true,
      },
    })

    const balance = accounts.reduce((acc, account) => acc + account.balance, 0)
    const incomes = accounts.reduce((acc, account) => acc + account.income, 0)
    const expenses = accounts.reduce((acc, account) => acc + account.expense, 0)

    return { balance, incomes, expenses }
  }

  async create(transaction: Prisma.TransactionUncheckedCreateInput) {
    const createdTransaction = await prisma.transaction.create({
      data: transaction,
    })

    const income =
      transaction.type === TransactionEnum.INCOME ? transaction.amount : 0
    const expense =
      transaction.type === TransactionEnum.EXPENSE ? transaction.amount : 0
    const balance =
      transaction.type === TransactionEnum.INCOME
        ? transaction.amount
        : -transaction.amount

    await prisma.account.update({
      where: { id: transaction.account_id },
      data: {
        income: { increment: income },
        expense: { increment: expense },
        balance: { increment: balance },
      },
    })

    return createdTransaction
  }

  async delete(id: string) {
    const deletedTransaction = await prisma.transaction.update({
      where: { id },
      data: { deleted_at: new Date() },
    })

    const income =
      deletedTransaction.type === TransactionEnum.INCOME
        ? -deletedTransaction.amount
        : 0
    const expense =
      deletedTransaction.type === TransactionEnum.EXPENSE
        ? -deletedTransaction.amount
        : 0
    const balance =
      deletedTransaction.type === TransactionEnum.INCOME
        ? -deletedTransaction.amount
        : deletedTransaction.amount

    await prisma.account.update({
      where: { id: deletedTransaction.account_id },
      data: {
        income: { increment: income },
        expense: { increment: expense },
        balance: { increment: balance },
      },
    })
  }

  async getGraphicsWeek(userId: string) {
    const day = new Date().getDay()

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - day)),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    })

    const balance: Balance[] = new Array(7).fill({
      balance: 0,
      incomes: 0,
      expenses: 0,
    })

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

      balance[i] = { balance: incomes - expenses, incomes, expenses }
    }

    return balance
  }

  async getGraphicsMonth(userId: string) {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate()

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        date: {
          gte: new Date(new Date().setDate(1)),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
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

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        date: {
          gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - year),
          ),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    })

    const balance: Balance[] = new Array(12).fill({
      balance: 0,
      incomes: 0,
      expenses: 0,
    })

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
}
