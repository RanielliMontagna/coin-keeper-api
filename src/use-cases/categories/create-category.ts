import { Category, Color } from '@prisma/client'

import { CategoryRepository } from '@/repositories/category-repository'
import { UserRepository } from '@/repositories/user-repository'

import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export enum ColorEnum {
  RED = 'RED',
  PINK = 'PINK',
  PURPLE = 'PURPLE',
  DEEP_PURPLE = 'DEEP_PURPLE',
  INDIGO = 'INDIGO',
  BLUE = 'BLUE',
  LIGHT_BLUE = 'LIGHT_BLUE',
  CYAN = 'CYAN',
  TEAL = 'TEAL',
  GREEN = 'GREEN',
  LIGHT_GREEN = 'LIGHT_GREEN',
  LIME = 'LIME',
  YELLOW = 'YELLOW',
  AMBER = 'AMBER',
  ORANGE = 'ORANGE',
  DEEP_ORANGE = 'DEEP_ORANGE',
  BROWN = 'BROWN',
  GREY = 'GREY',
  BLUE_GREY = 'BLUE_GREY',
  BLACK = 'BLACK',
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
