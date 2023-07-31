import { randomUUID } from 'node:crypto'

import { Category, Prisma } from '@prisma/client'
import {
  CategoryRepository,
  FindManyByUserIdOptions,
} from '../category-repository'
import { ColorEnum } from '@/use-cases/categories/create-category'

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.find((c) => c.id === id)

    if (!category) {
      return null
    }

    if (category.deleted_at) {
      return null
    }

    return category
  }

  async findByName(name: string, userId: string): Promise<Category | null> {
    const category = this.categories.find(
      (c) => c.name === name && c.user_id === userId,
    )

    if (!category) {
      return null
    }

    if (category.deleted_at) {
      return null
    }

    return category
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const categories = this.categories.filter((c) => {
      if (c.deleted_at) return false
      if (c.user_id === userId) return true
    })

    if (options?.search) {
      return categories.filter((a) =>
        a.name
          .toLowerCase()
          .includes(options.search?.toLocaleLowerCase() as string),
      )
    }

    return categories
  }

  async create(
    category: Prisma.CategoryUncheckedCreateInput,
  ): Promise<Category> {
    const newCategory: Category = {
      id: category.id || randomUUID(),
      name: category.name,
      color: category.color as ColorEnum,
      description: category.description || null,
      user_id: category.user_id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.categories.push(newCategory)

    return newCategory
  }

  async update(
    category: Prisma.CategoryUncheckedUpdateInput,
  ): Promise<Category> {
    const _category = this.categories.find(
      (c) => c.id === category.id,
    ) as Category

    const updatedCategory: Category = {
      id: _category.id,
      name: typeof category.name === 'string' ? category.name : _category.name,
      color:
        typeof category.color === 'number' ? category.color : _category.color,
      description:
        typeof category.description === 'string'
          ? category.description
          : _category.description,
      user_id: _category.user_id,
      created_at: _category.created_at,
      updated_at: new Date(),
      deleted_at: null,
    }

    return updatedCategory
  }

  async delete(id: string) {
    const categoryIndex = this.categories.findIndex((c) => c.id === id)

    const category = this.categories[categoryIndex]

    this.categories.splice(categoryIndex, 1)

    this.categories[categoryIndex] = {
      ...category,
      deleted_at: new Date(),
    }
  }
}
