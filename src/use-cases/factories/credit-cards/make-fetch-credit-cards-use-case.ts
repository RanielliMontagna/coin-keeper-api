import { FetchCreditCardsUseCase } from '@/use-cases/credit-card/fetch-credit-cards'

import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeFetchCreditCardsUseCase() {
  const creditCardRepository = new PrismaCreditCardRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchCreditCardsUseCase(
    creditCardRepository,
    userRepository,
  )

  return useCase
}
