import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { Options } from '../options/options'

interface FetchCategoriesUseCaseRequest {
  userId: string
  options?: Options
}

interface FetchCategoriesUseCaseResponse {
  categories: {
    id: Category['id']
    name: Category['name']
    description: Category['description']
    color: Category['color']
  }[]
}

export class FetchCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    options,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const categories = await this.categoryRepository.findManyByUserId(
      userId,
      options,
    )

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
      })),
    }
  }
}
