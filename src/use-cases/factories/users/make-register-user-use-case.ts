import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaOrganizationRepository } from '@/repositories/prisma/prisma-organization-repository'
import { RegisterUserUseCase } from '@/use-cases/users/register-user'

export function makeRegisterUserUseCase() {
  const usersRepository = new PrismaUserRepository()
  const organizationsRepository = new PrismaOrganizationRepository()

  const useCase = new RegisterUserUseCase(
    usersRepository,
    organizationsRepository,
  )

  return useCase
}
