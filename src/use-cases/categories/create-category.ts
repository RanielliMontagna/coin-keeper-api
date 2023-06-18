import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'

import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export interface CreateCategoryUseCaseRequest {
  name: string
  description?: string
  color: number
  userId: string
}

export interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    name,
    description,
    color,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const categoryAlreadyExists = await this.categoryRepository.findByName(
      name,
      userId,
    )

    if (categoryAlreadyExists) {
      throw new CategoryAlreadyExistsError()
    }

    const category = await this.categoryRepository.create({
      name,
      description,
      color,
      user_id: userId,
    })

    return {
      category,
    }
  }
}
