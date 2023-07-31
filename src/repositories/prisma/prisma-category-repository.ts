import { Category, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import {
  CategoryRepository,
  FindManyByUserIdOptions,
} from '../category-repository'

export class PrismaCategoryRepository implements CategoryRepository {
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) return null
    if (category.deleted_at) return null

    return category
  }

  async findByName(name: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: { name, user_id: userId, deleted_at: null },
    })

    return category
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const orArray: Prisma.CategoryWhereInput[] = [
      {
        name: {
          contains: options?.search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: options?.search,
          mode: 'insensitive',
        },
      },
    ]

    const categories = await prisma.category.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        OR: options?.search ? orArray : undefined,
      },
    })

    return categories
  }

  async create(category: Prisma.CategoryUncheckedCreateInput) {
    const createdCategory = await prisma.category.create({
      data: category,
    })

    return createdCategory
  }

  async update(category: Prisma.CategoryUncheckedUpdateInput) {
    const updatedCategory = await prisma.category.update({
      where: { id: category.id as string },
      data: category,
    })

    return updatedCategory
  }
  async delete(id: string) {
    await prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }
}
