import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

import { CreateAccountUseCase } from '@/use-cases/accounts/create-account'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeCreateAccountUseCase() {
  const accountRepository = new PrismaAccountRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new CreateAccountUseCase(accountRepository, userRepository)

  return useCase
}
