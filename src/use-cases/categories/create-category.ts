import { Category } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'

import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export enum ColorEnum {
  RED = 0,
  PINK = 1,
  PURPLE = 2,
  DEEP_PURPLE = 3,
  INDIGO = 4,
  BLUE = 5,
  LIGHT_BLUE = 6,
  CYAN = 7,
  TEAL = 8,
  GREEN = 9,
  LIGHT_GREEN = 10,
  LIME = 11,
  YELLOW = 12,
  AMBER = 13,
  ORANGE = 14,
  DEEP_ORANGE = 15,
  BROWN = 16,
  GREY = 17,
  BLUE_GREY = 18,
  BLACK = 19,
}

export interface CreateCategoryUseCaseRequest {
  name: string
  description?: string
  color: ColorEnum
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
