import { Category, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

import { CategoryRepository } from '../category-repository'

export class PrismaCategoryRepository implements CategoryRepository {
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    return category
  }

  async findByName(name: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: { name, user_id: userId },
    })

    return category
  }

  async findManyByUserId(userId: string) {
    const categorys = await prisma.category.findMany({
      where: { user_id: userId },
    })

    return categorys
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
    const deletedCategory = await prisma.category.delete({
      where: { id },
    })

    return deletedCategory
  }
}
