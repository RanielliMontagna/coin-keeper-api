import { CreditCard } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

interface DeleteCreditCardUseCaseRequest {
  creditCardId: string
}

export class DeleteCreditCardUseCase {
  constructor(private creditCardRepository: CreditCardRepository) {}

  async execute({
    creditCardId,
  }: DeleteCreditCardUseCaseRequest): Promise<void> {
    const creditCard = await this.creditCardRepository.findById(creditCardId)

    if (!creditCard) {
      throw new CreditCardNotFoundError()
    }

    await this.creditCardRepository.delete(creditCardId)
  }
}
