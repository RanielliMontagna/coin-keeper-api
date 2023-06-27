import { DeleteCategoryUseCase } from '@/use-cases/categories/delete-category'
import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'

export function makeDeleteCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository()

  const useCase = new DeleteCategoryUseCase(categoryRepository)

  return useCase
}
