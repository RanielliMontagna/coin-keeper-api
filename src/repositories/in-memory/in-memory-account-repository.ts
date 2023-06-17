import { randomUUID } from 'node:crypto'

import type { Account, Prisma } from '@prisma/client'
import type { AccountRepository } from '../account-repository'

export class InMemoryAccountRepository implements AccountRepository {
  public accounts: Account[] = []

  async findById(id: string) {
    const account = this.accounts.find((a) => a.id === id)

    if (!account) {
      return null
    }

    return account
  }

  async create(account: Prisma.AccountUncheckedCreateInput) {
    const newAccount: Account = {
      id: account.id || randomUUID(),
      name: account.name,
      balance: account.balance,
      created_at: new Date(),
      updated_at: new Date(),

      user_id: account.user_id,
    }

    this.accounts.push(newAccount)

    return newAccount
  }

  async update(account: Account) {
    const accountIndex = this.accounts.findIndex((a) => a.id === account.id)

    if (accountIndex === -1) {
      return null
    }

    this.accounts[accountIndex] = account

    return account
  }

  async delete(id: string) {
    const accountIndex = this.accounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      return null
    }

    const account = this.accounts[accountIndex]

    this.accounts.splice(accountIndex, 1)

    return account
  }
}
