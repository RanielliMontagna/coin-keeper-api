import { GetCreditCardUseCase } from '@/use-cases/credit-card/get-credit-card'

import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetCreditCardUseCase() {
  const creditCardRepository = new PrismaCreditCardRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetCreditCardUseCase(creditCardRepository, userRepository)

  return useCase
}
