import { CreditCard } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchCreditCardsUseCaseRequest {
  userId: string
}

interface FetchCreditCardsUseCaseResponse {
  creditCards: {
    id: CreditCard['id']
    name: CreditCard['name']
    flag: CreditCard['flag']
    limit: CreditCard['limit']
    closingDay: CreditCard['closingDay']
    dueDay: CreditCard['dueDay']
  }[]
}

export class FetchCreditCardsUseCase {
  constructor(
    private creditCardRepository: CreditCardRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchCreditCardsUseCaseRequest): Promise<FetchCreditCardsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const creditCards = await this.creditCardRepository.findManyByUserId(userId)

    return {
      creditCards: creditCards.map((creditCard) => ({
        id: creditCard.id,
        name: creditCard.name,
        flag: creditCard.flag,
        limit: creditCard.limit,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
        account: {
          id: creditCard.account.id,
          name: creditCard.account.name,
          institution: creditCard.account.institution,
        },
      })),
    }
  }
}
