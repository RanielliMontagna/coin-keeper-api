import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

import { CreateCategoryUseCase } from '@/use-cases/categories/create-category'
import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'

export function makeCreateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new CreateCategoryUseCase(categoryRepository, userRepository)

  return useCase
}
