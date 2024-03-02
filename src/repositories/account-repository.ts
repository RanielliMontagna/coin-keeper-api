import type { Account, Prisma } from '@prisma/client'
import { Options } from '@/use-cases/options/options'

export interface FindManyByUserIdOptions extends Pick<Options, 'search'> {}

export interface UpdateBalance {
  accountId: string
  userId: string
  expense?: number
  income?: number
}

export interface AccountRepository {
  findById(id: string): Promise<Account | null>
  findManyByUserId(
    userId: string,
    options?: FindManyByUserIdOptions,
  ): Promise<Account[]>
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
  update(account: Prisma.AccountUncheckedUpdateInput): Promise<Account>
  updateBalance(payload: UpdateBalance): Promise<Account | null>
  delete(id: string): Promise<void>
}
