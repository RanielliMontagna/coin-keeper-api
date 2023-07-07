import { Account, CreditCard } from '@prisma/client'

import { UserRepository } from '@/repositories/user-repository'
import { CreditCardRepository } from '@/repositories/credit-card-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

interface GetCreditCardUseCaseRequest {
  creditCardId: string
  userId: string
}

interface GetCreditCardUseCaseResponse {
  creditCard: {
    id: CreditCard['id']
    name: CreditCard['name']
    limit: CreditCard['limit']
    flag: CreditCard['flag']
    closingDay: CreditCard['closingDay']
    dueDay: CreditCard['dueDay']
    account: {
      id: Account['id']
      name: Account['name']
      institution: Account['institution']
    }
  }
}

export class GetCreditCardUseCase {
  constructor(
    private creditCardRepository: CreditCardRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    creditCardId,
    userId,
  }: GetCreditCardUseCaseRequest): Promise<GetCreditCardUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const creditCard = await this.creditCardRepository.findById(creditCardId)

    if (!creditCard) {
      throw new CreditCardNotFoundError()
    }

    return {
      creditCard: {
        id: creditCard.id,
        name: creditCard.name,
        limit: creditCard.limit,
        flag: creditCard.flag,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
        account: {
          id: creditCard.account.id,
          name: creditCard.account.name,
          institution: creditCard.account.institution,
        },
      },
    }
  }
}
