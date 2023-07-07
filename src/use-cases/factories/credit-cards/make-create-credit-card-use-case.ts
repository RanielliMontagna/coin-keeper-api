import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository'

import { CreateCreditCardUseCase } from '@/use-cases/credit-card/create-credit-card'
import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'

export function makeCreateCreditCardUseCase() {
  const creditCardRepository = new PrismaCreditCardRepository()
  const AccountRepository = new PrismaAccountRepository()

  const useCase = new CreateCreditCardUseCase(
    creditCardRepository,
    AccountRepository,
  )

  return useCase
}
