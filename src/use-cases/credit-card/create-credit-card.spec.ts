import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { CreateCreditCardUseCase, FlagEnum } from './create-credit-card'

let creditCardRepository: InMemoryCreditCardRepository
let accountRepository: InMemoryAccountRepository
let sut: CreateCreditCardUseCase

describe('Create Credit Card Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    creditCardRepository = new InMemoryCreditCardRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new CreateCreditCardUseCase(creditCardRepository, accountRepository)

    await accountRepository.create({
      id: userId,
      name: 'account-name',
      balance: 0,
      user_id: userId,
    })
  })

  it('should create a credit card', async () => {
    const creditCard = await sut.execute({
      name: 'credit-card-name',
      limit: 1000,
      flag: FlagEnum.VISA,
      closingDay: 10,
      dueDay: 20,
      accountId: userId,
      userId,
    })

    expect(creditCard.creditCard).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    )
  })

  it('should not be able to create a credit card with an invalid account', async () => {
    await expect(
      sut.execute({
        name: 'credit-card-name',
        limit: 1000,
        flag: FlagEnum.VISA,
        closingDay: 10,
        dueDay: 20,
        accountId: 'invalid-account-id',
        userId,
      }),
    ).rejects.toThrowError()
  })
})
