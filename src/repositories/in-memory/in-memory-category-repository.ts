import { randomUUID } from 'node:crypto'

import { Category, Color, Prisma } from '@prisma/client'
import {
  CategoryRepository,
  FindManyByUserIdOptions,
} from '../category-repository'

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.find((c) => c.id === id)

    if (!category) {
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

    return category
  }

  async findManyByUserId(userId: string, options: FindManyByUserIdOptions) {
    const categories = this.categories.filter((c) => c.user_id === userId)

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
      color: category.color as Color,
      description: category.description || null,
      user_id: category.user_id,
      created_at: new Date(),
      updated_at: new Date(),
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
        typeof category.color === 'string' ? category.color : _category.color,
      description:
        typeof category.description === 'string'
          ? category.description
          : _category.description,
      user_id: _category.user_id,
      created_at: _category.created_at,
      updated_at: new Date(),
    }

    return updatedCategory
  }

  async delete(id: string): Promise<Category> {
    const categoryIndex = this.categories.findIndex((c) => c.id === id)

    const category = this.categories[categoryIndex]

    this.categories.splice(categoryIndex, 1)

    return category
  }
}
