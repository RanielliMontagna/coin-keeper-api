import { randomUUID } from 'node:crypto'

import {
  Institution,
  type Account,
  type Category,
  type Prisma,
  type User,
  Color,
} from '@prisma/client'
import type { UserRepository } from '../user-repository'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []
  public accounts: Account[] = []
  public categories: Category[] = []

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: Prisma.UserUncheckedCreateInput) {
    const newUser: User = {
      id: user.id || randomUUID(),
      name: user.name,
      email: user.email,
      password_hash: user.password_hash,
      created_at: new Date(),
      organization_id: user.organization_id,
      type: user.type,
      updated_at: new Date(),
    }

    const account = user.Account?.create as Prisma.AccountCreateInput

    if (account) {
      const newAccount: Account = {
        id: randomUUID(),
        name: account.name,
        user_id: newUser.id,
        balance: account.balance,
        institution: account.institution as Institution,
        expense: 0,
        income: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }

      this.accounts.push(newAccount)
    }

    const category = user.Category?.createMany
      ?.data as Prisma.CategoryCreateInput[]

    if (category) {
      const newCategories: Category[] = category.map((c) => ({
        id: randomUUID(),
        name: c.name,
        color: c.color as Color,
        description: c.description || null,
        user_id: newUser.id,
        created_at: new Date(),
        updated_at: new Date(),
      }))
      this.categories.push(...newCategories)
    }

    this.users.push(newUser)

    return newUser
  }
}
