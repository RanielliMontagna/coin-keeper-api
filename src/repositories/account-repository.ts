import type { Account, Prisma } from '@prisma/client'
import { Options } from '@/use-cases/options/options'

export interface FindManyByUserIdOptions extends Pick<Options, 'search'> {}
export interface AccountRepository {
  findById(id: string): Promise<Account | null>
  findManyByUserId(
    userId: string,
    options?: FindManyByUserIdOptions,
  ): Promise<Account[]>
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
  update(account: Prisma.AccountUncheckedUpdateInput): Promise<Account>
  delete(id: string): Promise<Account>
}
