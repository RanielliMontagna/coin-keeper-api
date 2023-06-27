import { randomUUID } from 'node:crypto'

import type { Prisma, User } from '@prisma/client'
import type { UserRepository } from '../user-repository'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

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

    this.users.push(newUser)

    return newUser
  }
}
