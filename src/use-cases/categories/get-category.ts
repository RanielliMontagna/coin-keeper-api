import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

interface GetCategoryUseCaseRequest {
  userId: string
  categoryId: string
}

interface GetCategoryUseCaseResponse {
  category: {
    id: Category['id']
    name: Category['name']
    description: Category['description']
    color: Category['color']
  }
}

export class GetCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    categoryId,
  }: GetCategoryUseCaseRequest): Promise<GetCategoryUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new CategoryNotFoundError()
    }

    return {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
      },
    }
  }
}
