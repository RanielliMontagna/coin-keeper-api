import { GetAccountUseCase } from '@/use-cases/accounts/get-account'

import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetAccountUseCase() {
  const accountRepository = new PrismaAccountRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetAccountUseCase(accountRepository, userRepository)

  return useCase
}
