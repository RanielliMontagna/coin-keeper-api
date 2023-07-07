import { DeleteCreditCardUseCase } from '@/use-cases/credit-card/delete-credit-card'
import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'

export function makeDeleteCreditCardUseCase() {
  const creditCardRepository = new PrismaCreditCardRepository()

  const useCase = new DeleteCreditCardUseCase(creditCardRepository)

  return useCase
}
