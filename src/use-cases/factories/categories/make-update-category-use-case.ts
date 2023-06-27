import { UpdateCategoryUseCase } from '@/use-cases/categories/update-category'
import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'

export function makeUpdateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository()

  const useCase = new UpdateCategoryUseCase(categoryRepository)

  return useCase
}
