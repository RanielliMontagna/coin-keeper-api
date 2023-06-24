import { FetchCategoriesUseCase } from '@/use-cases/categories/fetch-categories'

import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeFetchCategoriesUseCase() {
  const categoryRepository = new PrismaCategoryRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchCategoriesUseCase(categoryRepository, userRepository)

  return useCase
}
