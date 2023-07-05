import { randomUUID } from 'node:crypto'

import type { Account, Prisma } from '@prisma/client'
import type {
  AccountRepository,
  FindManyByUserIdOptions,
} from '../account-repository'

export class InMemoryAccountRepository implements AccountRepository {
  public accounts: Account[] = []

  async findById(id: string) {
    const account = this.accounts.find((a) => a.id === id)

    if (!account) {
      return null
    }

    return account
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const accounts = this.accounts.filter((a) => a.user_id === userId)

    if (options?.search) {
      return accounts.filter((a) =>
        a.name
          .toLowerCase()
          .includes(options.search?.toLocaleLowerCase() as string),
      )
    }

    return accounts
  }

  async create(account: Prisma.AccountUncheckedCreateInput) {
    const newAccount: Account = {
      id: account.id || randomUUID(),
      name: account.name,
      balance: account.balance,
      expense: account.expense || 0,
      income: account.income || 0,

      created_at: new Date(),
      updated_at: new Date(),

      user_id: account.user_id,
    }

    this.accounts.push(newAccount)

    return newAccount
  }

  async update(account: Prisma.AccountUncheckedUpdateInput) {
    const _account = this.accounts.find((a) => a.id === account.id) as Account

    const updatedAccount: Account = {
      id: _account.id,
      name: typeof account.name === 'string' ? account.name : _account.name,
      balance:
        typeof account.balance === 'number'
          ? account.balance
          : _account.balance,
      expense: typeof account.expense === 'number' ? account.expense : 0,
      income: typeof account.income === 'number' ? account.income : 0,
      created_at: _account.created_at,
      updated_at: new Date(),
      user_id: _account.user_id,
    }

    return updatedAccount
  }

  async delete(id: string) {
    const accountIndex = this.accounts.findIndex((a) => a.id === id)

    const account = this.accounts[accountIndex]

    this.accounts.splice(accountIndex, 1)

    return account
  }
}
