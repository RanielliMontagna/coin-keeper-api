import { randomUUID } from 'node:crypto'

import type { Account, Prisma } from '@prisma/client'
import type {
  AccountRepository,
  FindManyByUserIdOptions,
  UpdateBalance,
} from '../account-repository'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'

export class InMemoryAccountRepository implements AccountRepository {
  public accounts: Account[] = []

  async findById(id: string) {
    const account = this.accounts.find((a) => a.id === id)

    if (!account) {
      return null
    }

    if (account.deleted_at) {
      return null
    }

    return account
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const accounts = this.accounts.filter((a) => {
      if (a.deleted_at) return false
      if (a.user_id === userId) return true
    })

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
      institution: account.institution || InstitutionEnum.OTHER,
      balance: account.balance || 0,
      expense: account.expense || 0,
      income: account.income || 0,

      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,

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
      institution:
        typeof account.institution === 'number'
          ? account.institution
          : _account.institution,
      balance:
        typeof account.balance === 'number'
          ? account.balance
          : _account.balance,
      expense: 0,
      income: 0,
      created_at: _account.created_at,
      updated_at: new Date(),
      deleted_at: null,
      user_id: _account.user_id,
    }

    return updatedAccount
  }

  async delete(id: string) {
    const accountIndex = this.accounts.findIndex((a) => a.id === id)

    const account = this.accounts[accountIndex]

    this.accounts[accountIndex] = {
      ...account,
      deleted_at: new Date(),
    }
  }

  async updateBalance({
    accountId,
    userId,
    expense = 0,
    income = 0,
  }: UpdateBalance): Promise<Account> {
    const account = this.accounts.find(
      (a) => a.id === accountId && a.user_id === userId,
    ) as Account

    const updatedAccount = {
      ...account,
      balance: account.balance + income - expense,
      expense: account.expense + expense,
      income: account.income + income,
    }

    const accountIndex = this.accounts.findIndex((a) => a.id === accountId)
    this.accounts[accountIndex] = updatedAccount

    return updatedAccount
  }
}
