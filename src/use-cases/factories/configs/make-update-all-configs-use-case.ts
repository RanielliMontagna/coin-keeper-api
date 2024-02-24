import { PrismaConfigRepository } from '@/repositories/prisma/prisma-config-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { UpdateAllConfigsUseCase } from '@/use-cases/config/update-all-configs'

export function makeUpdateAllConfigsUseCase() {
  const config = new PrismaConfigRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new UpdateAllConfigsUseCase(config, userRepository)

  return useCase
}
