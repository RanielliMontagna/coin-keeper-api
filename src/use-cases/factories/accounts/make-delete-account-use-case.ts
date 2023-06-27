import { DeleteAccountUseCase } from '@/use-cases/accounts/delete-account'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeDeleteAccountUseCase() {
  const accountRepository = new PrismaAccountRepository()

  const useCase = new DeleteAccountUseCase(accountRepository)

  return useCase
}
