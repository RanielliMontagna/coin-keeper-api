import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteCategoryUseCase } from './delete-category'

let categoryRepository: InMemoryCategoryRepository
let userRepository: InMemoryUserRepository
let sut: DeleteCategoryUseCase

describe('Update Category Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    categoryRepository = new InMemoryCategoryRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteCategoryUseCase(categoryRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to delete a category', async () => {
    const category = await categoryRepository.create({
      name: 'Category Name',
      description: 'Category Description',
      color: 0,
      user_id: userId,
    })

    const response = await sut.execute({
      categoryId: category.id,
    })

    expect(response.category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Category Name',
        description: 'Category Description',
        color: 0,
        user_id: userId,
      }),
    )
  })

  it('should not be able to delete a non-existing category', async () => {
    await expect(
      sut.execute({
        categoryId: 'non-existing-category-id',
      }),
    ).rejects.toThrow()
  })
})
