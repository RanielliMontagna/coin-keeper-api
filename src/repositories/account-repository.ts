import type { Account, Prisma } from '@prisma/client'

export interface AccountRepository {
  findById(id: string): Promise<Account | null>
  findManyByUserId(userId: string): Promise<Account[]>
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
  update(account: Prisma.AccountUncheckedUpdateInput): Promise<Account>
  delete(id: string): Promise<Account>
}
