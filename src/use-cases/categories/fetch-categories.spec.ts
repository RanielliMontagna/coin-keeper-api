import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { FetchCategoriesUseCase } from './fetch-categories'

let categoryRepository: InMemoryCategoryRepository
let userRepository: InMemoryUserRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    categoryRepository = new InMemoryCategoryRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchCategoriesUseCase(categoryRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to fetch categories', async () => {
    await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: 0,
      user_id: userId,
    })

    const response = await sut.execute({
      userId,
    })

    expect(response.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Category Name',
          description: 'Category Description',
          color: 0,
        }),
      ]),
    )
  })

  it('should not be able to fetch categories with an inexistent user', async () => {
    await expect(
      sut.execute({
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})