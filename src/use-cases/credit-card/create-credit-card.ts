import { CreditCard } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { AccountRepository } from '@/repositories/account-repository'
import { AccountNotFoundError } from '../errors/account-not-found-error'

export enum FlagEnum {
  OTHER = 0,
  VISA = 1,
  MASTERCARD = 2,
  ELO = 3,
  AMERICAN_EXPRESS = 4,
  DINERS_CLUB = 5,
  DISCOVER = 6,
  JCB = 7,
}

export interface CreateCreditCardUseCaseRequest {
  name: string
  limit: number
  flag: FlagEnum
  closingDay: number
  dueDay: number
  accountId: string
  userId: string
}

export interface CreateCreditCardUseCaseResponse {
  creditCard: CreditCard
}

export class CreateCreditCardUseCase {
  constructor(
    private creditCardRepository: CreditCardRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    name,
    limit,
    flag,
    closingDay,
    dueDay,
    accountId,
    userId,
  }: CreateCreditCardUseCaseRequest): Promise<CreateCreditCardUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const creditCard = await this.creditCardRepository.create({
      name,
      limit,
      flag,
      closingDay,
      dueDay,
      account_id: accountId,
      user_id: userId,
    })

    return { creditCard }
  }
}
