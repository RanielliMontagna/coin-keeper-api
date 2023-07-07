import { Account, CreditCard } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { AccountRepository } from '@/repositories/account-repository'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'
import { CreateCreditCardUseCaseRequest } from './create-credit-card'
import { CreditCardNotFoundError } from '../errors/credit-card-not-found-error'

export interface UpdateCreditCardUseCaseRequest
  extends Partial<CreateCreditCardUseCaseRequest> {
  accountId: string
  id: string
}

export interface UpdateCreditCardUseCaseResponse {
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

export class UpdateCreditCardUseCase {
  constructor(
    private creditCardRepository: CreditCardRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    id,
    name,
    limit,
    flag,
    closingDay,
    dueDay,
    accountId,
    userId,
  }: UpdateCreditCardUseCaseRequest): Promise<UpdateCreditCardUseCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const creditCard = await this.creditCardRepository.findById(id)

    if (!creditCard) {
      throw new CreditCardNotFoundError()
    }

    const updatedCreditCard = await this.creditCardRepository.update({
      id,
      name,
      limit,
      flag,
      closingDay,
      dueDay,
      account_id: accountId,
      user_id: userId,
    })

    return {
      creditCard: {
        ...updatedCreditCard,
        account: {
          id: account.id,
          name: account.name,
          institution: account.institution,
        },
      },
    }
  }
}
