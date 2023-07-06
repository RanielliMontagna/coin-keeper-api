import { CreditCard } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

interface DeleteCreditCardUseCaseRequest {
  creditCardId: string
}

interface DeleteCreditCardUseCaseResponse {
  creditCard: {
    id: CreditCard['id']
    name: CreditCard['name']
    limit: CreditCard['limit']
    flag: CreditCard['flag']
    closingDay: CreditCard['closingDay']
    dueDay: CreditCard['dueDay']
  }
}

export class DeleteCreditCardUseCase {
  constructor(private creditCardRepository: CreditCardRepository) {}

  async execute({
    creditCardId,
  }: DeleteCreditCardUseCaseRequest): Promise<DeleteCreditCardUseCaseResponse> {
    const creditCard = await this.creditCardRepository.findById(creditCardId)

    if (!creditCard) {
      throw new CreditCardNotFoundError()
    }

    await this.creditCardRepository.delete(creditCardId)

    return {
      creditCard: {
        id: creditCard.id,
        name: creditCard.name,
        limit: creditCard.limit,
        flag: creditCard.flag,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
      },
    }
  }
}
