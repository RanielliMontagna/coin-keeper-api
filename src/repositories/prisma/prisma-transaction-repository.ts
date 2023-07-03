import { Transaction, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { TransactionRepository } from '../transaction-repository'
import { TransactionType } from '@/use-cases/transactions/create-transaction'

export class PrismaTransactionRepository implements TransactionRepository {
  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    return transaction
  }

  async findManyByAccountId(accountId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { account_id: accountId },
    })

    return transactions
  }

  async findManyByUserId(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
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

  async findFiveLatestByUserId(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
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
      where: { user_id: userId },
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
      transaction.type === TransactionType.INCOME ? transaction.amount : 0
    const expense =
      transaction.type === TransactionType.EXPENSE ? transaction.amount : 0
    const balance =
      transaction.type === TransactionType.INCOME
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
    const deletedTransaction = await prisma.transaction.delete({
      where: { id },
    })

    const income =
      deletedTransaction.type === TransactionType.INCOME
        ? -deletedTransaction.amount
        : 0
    const expense =
      deletedTransaction.type === TransactionType.EXPENSE
        ? -deletedTransaction.amount
        : 0
    const balance =
      deletedTransaction.type === TransactionType.INCOME
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

    return deletedTransaction
  }
}
