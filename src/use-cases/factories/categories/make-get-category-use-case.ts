import { GetCategoryUseCase } from '@/use-cases/categories/get-category'

import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetCategoryUseCase(categoryRepository, userRepository)

  return useCase
}
