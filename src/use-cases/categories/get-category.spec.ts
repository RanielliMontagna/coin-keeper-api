import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

import { GetCategoryUseCase } from './get-category'
import { ColorEnum } from './create-category'

let categoryRepository: InMemoryCategoryRepository
let userRepository: InMemoryUserRepository
let sut: GetCategoryUseCase

describe('Get Category Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    categoryRepository = new InMemoryCategoryRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetCategoryUseCase(categoryRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to get a category', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: ColorEnum.RED,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
      userId,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: ColorEnum.RED,
      }),
    )
  })

  it('should not be able to get a category with an inexistent user', async () => {
    await expect(
      sut.execute({
        categoryId: 'category-id',
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get a non-existing category', async () => {
    await expect(
      sut.execute({
        categoryId: 'non-existing-category-id',
        userId,
      }),
    ).rejects.toBeInstanceOf(CategoryNotFoundError)
  })
})
