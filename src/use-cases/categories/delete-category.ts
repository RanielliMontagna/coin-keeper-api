import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ categoryId }: DeleteCategoryUseCaseRequest): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new CategoryNotFoundError()
    }

    await this.categoryRepository.delete(categoryId)
  }
}
