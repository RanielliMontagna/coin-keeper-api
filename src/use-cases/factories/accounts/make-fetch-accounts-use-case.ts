import { FetchAccountsUseCase } from '@/use-cases/accounts/fetch-accounts'

import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeFetchAccountsUseCase() {
  const accountRepository = new PrismaAccountRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchAccountsUseCase(accountRepository, userRepository)

  return useCase
}
