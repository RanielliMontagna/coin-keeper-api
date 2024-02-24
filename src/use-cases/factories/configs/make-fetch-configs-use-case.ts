import { PrismaConfigRepository } from '@/repositories/prisma/prisma-config-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { FetchConfigsUseCase } from '@/use-cases/config/fetch-configs'

export function makeFetchConfigsUseCase() {
  const config = new PrismaConfigRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchConfigsUseCase(config, userRepository)

  return useCase
}
