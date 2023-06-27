import { Category, Prisma } from '@prisma/client'

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>
  findByName(name: string, userId: string): Promise<Category | null>
  findManyByUserId(userId: string): Promise<Category[]>
  create(category: Prisma.CategoryUncheckedCreateInput): Promise<Category>
  update(category: Prisma.CategoryUncheckedUpdateInput): Promise<Category>
  delete(id: string): Promise<Category>
}
