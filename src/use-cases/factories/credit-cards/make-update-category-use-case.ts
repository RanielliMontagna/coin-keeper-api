import { UpdateCreditCardUseCase } from '@/use-cases/credit-card/update-credit-card'
import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

export function makeUpdateCreditCardUseCase() {
  const creditCardRepository = new PrismaCreditCardRepository()
  const accountRepository = new PrismaAccountRepository()

  const useCase = new UpdateCreditCardUseCase(
    creditCardRepository,
    accountRepository,
  )

  return useCase
}
