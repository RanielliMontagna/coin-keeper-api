import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetUserProfileUseCase } from '@/use-cases/users/get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository()

  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}
