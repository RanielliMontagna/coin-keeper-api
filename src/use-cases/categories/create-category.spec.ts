import { Color } from '@prisma/client'

import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { CreateCategoryUseCase } from './create-category'
import { UserTypeEnum } from '../users/register-user'
import { CategoryAlreadyExistsError } from '../errors/category-already-exists'

let categoryRepository: InMemoryCategoryRepository
let userRepository: InMemoryUserRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    categoryRepository = new InMemoryCategoryRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateCategoryUseCase(categoryRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to create a new category', async () => {
    const response = await sut.execute({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.GREEN,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: Color.GREEN,
        user_id: userId,
      }),
    )
  })

  it('should not be able to create a new category with an inexistent user', async () => {
    await expect(
      sut.execute({
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new category with an already used name', async () => {
    await sut.execute({
      name: 'Category Name',
      description: 'Category Description',
      color: Color.RED,
      userId,
    })

    await expect(
      sut.execute({
        name: 'Category Name',
        description: 'Category Description',
        color: Color.RED,
        userId,
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should be able to create a new category without a description', async () => {
    const response = await sut.execute({
      name: 'Category Name',
      color: Color.RED,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: null,
        color: Color.RED,
        user_id: userId,
      }),
    )
  })
})
