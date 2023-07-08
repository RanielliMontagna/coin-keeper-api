import { randomUUID } from 'node:crypto'

import { Account, CreditCard, Prisma } from '@prisma/client'

import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

import { CreditCardRepository } from '../credit-card-repository'

export class InMemoryCreditCardRepository implements CreditCardRepository {
  public creditCards: CreditCard[] = []
  public accounts: Account[] = []

  async findById(id: string) {
    const creditCard = this.creditCards.find((c) => c.id === id)

    if (!creditCard) {
      return null
    }

    return {
      ...creditCard,
      account: {
        id: creditCard.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
    }
  }

  async findManyByUserId(userId: string) {
    const creditCards = this.creditCards.filter((c) => c.user_id === userId)

    return creditCards.map((c) => ({
      ...c,
      account: {
        id: c.account_id,
        name: 'Account Name',
        institution: InstitutionEnum.OTHER,
      },
    }))
  }

  async create(creditCard: Prisma.CreditCardUncheckedCreateInput) {
    const account = this.accounts.find((a) => a.id === creditCard.account_id)

    if (!account) {
      this.accounts.push({
        id: creditCard.account_id,
        name: 'Account Name',
        user_id: creditCard.user_id,
        institution: InstitutionEnum.OTHER,
        balance: 0,
        income: 0,
        expense: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const newCreditCard: CreditCard = {
      id: creditCard.id || randomUUID(),
      name: creditCard.name,
      limit: creditCard.limit,
      flag: creditCard.flag as FlagEnum,
      closingDay: creditCard.closingDay,
      dueDay: creditCard.dueDay,
      account_id: creditCard.account_id,
      user_id: creditCard.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.creditCards.push(newCreditCard)

    return newCreditCard
  }

  async update(creditCard: Prisma.CreditCardUncheckedCreateInput) {
    const _creditCard = this.creditCards.find(
      (c) => c.id === creditCard.id,
    ) as CreditCard

    const updatedCreditCard: CreditCard = {
      id: _creditCard.id,
      name:
        typeof creditCard.name === 'string'
          ? creditCard.name
          : _creditCard.name,
      limit:
        typeof creditCard.limit === 'number'
          ? creditCard.limit
          : _creditCard.limit,
      flag:
        typeof creditCard.flag === 'number'
          ? (creditCard.flag as FlagEnum)
          : _creditCard.flag,
      closingDay:
        typeof creditCard.closingDay === 'number'
          ? creditCard.closingDay
          : _creditCard.closingDay,
      dueDay:
        typeof creditCard.dueDay === 'number'
          ? creditCard.dueDay
          : _creditCard.dueDay,
      account_id: _creditCard.account_id,
      user_id: _creditCard.user_id,
      created_at: _creditCard.created_at,
      updated_at: new Date(),
    }

    return updatedCreditCard
  }

  async delete(id: string) {
    const accountIndex = this.creditCards.findIndex((a) => a.id === id)

    const account = this.creditCards[accountIndex]

    this.creditCards.splice(accountIndex, 1)

    return account
  }
}
