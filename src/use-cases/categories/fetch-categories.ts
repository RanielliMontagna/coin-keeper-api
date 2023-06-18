import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchCategoriesUseCaseRequest {
  userId: string
}

interface FetchCategoriesUseCaseResponse {
  categories: Category[]
}

export class FetchCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const categories = await this.categoryRepository.findManyByUserId(userId)

    return { categories }
  }
}
