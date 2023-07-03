import { Category, Prisma } from '@prisma/client'

import { Options } from '@/use-cases/options/options'

export interface FindManyByUserIdOptions extends Options {}

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>
  findByName(name: string, userId: string): Promise<Category | null>
  findManyByUserId(
    userId: string,
    options?: FindManyByUserIdOptions,
  ): Promise<Category[]>
  create(category: Prisma.CategoryUncheckedCreateInput): Promise<Category>
  update(category: Prisma.CategoryUncheckedUpdateInput): Promise<Category>
  delete(id: string): Promise<Category>
}
