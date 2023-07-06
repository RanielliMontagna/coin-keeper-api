import { Color } from '@prisma/client'

import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

import { UpdateCategoryUseCase } from './update-category'

let categoryRepository: InMemoryCategoryRepository
let userRepository: InMemoryUserRepository
let sut: UpdateCategoryUseCase

describe('Update Category Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    categoryRepository = new InMemoryCategoryRepository()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateCategoryUseCase(categoryRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to update a category', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        user_id: userId,
      }),
    )
  })

  it('should not be able to update a non-existing category', async () => {
    await expect(
      sut.execute({
        categoryId: 'non-existing-category-id',
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        userId,
      }),
    ).rejects.toBeInstanceOf(CategoryNotFoundError)
  })

  it('should be able to update a category without a description', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
      name: 'Category Name',
      color: Color.RED,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        user_id: userId,
      }),
    )
  })

  it('should be able to update a category without a color', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
      name: 'Category Name',
      description: 'Category Description',
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        user_id: userId,
      }),
    )
  })

  it('should be able to update a category without a name', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
      description: 'Category Description',
      color: Color.RED,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        user_id: userId,
      }),
    )
  })
})
