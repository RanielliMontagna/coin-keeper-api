import { UpdateAccountUseCase } from '@/use-cases/accounts/update-account'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeUpdateAccountUseCase() {
  const accountRepository = new PrismaAccountRepository()

  const useCase = new UpdateAccountUseCase(accountRepository)

  return useCase
}
