import type { CategoryRepository } from '@/repositories/category-repository'

import type {
  CreateCategoryUseCaseRequest,
  CreateCategoryUseCaseResponse,
} from './create-category'

import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

interface UpdateCategoryCaseRequest
  extends Partial<CreateCategoryUseCaseRequest> {
  categoryId: string
}

interface UpdateCategoryCaseResponse extends CreateCategoryUseCaseResponse {}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
    color,
    description,
    userId,
    categoryId,
  }: UpdateCategoryCaseRequest): Promise<UpdateCategoryCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new CategoryNotFoundError()
    }

    const updatedCategory = await this.categoryRepository.update({
      id: categoryId,
      name: name,
      color: color,
      description: description,
      user_id: userId,
    })

    return {
      category: updatedCategory,
    }
  }
}
