import type { Account, Prisma } from '@prisma/client'

export interface AccountRepository {
  findById(id: string): Promise<Account | null>
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
  update(account: Account): Promise<Account | null>
  delete(id: string): Promise<Account | null>
}
