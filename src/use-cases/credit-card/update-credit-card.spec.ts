import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { UpdateCreditCardUseCase } from './update-credit-card'
import { FlagEnum } from './create-credit-card'
import { InstitutionEnum } from '../accounts/create-account'

let creditCardRepository: InMemoryCreditCardRepository
let accountRepository: InMemoryAccountRepository
let sut: UpdateCreditCardUseCase

describe('Update Credit Card Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    creditCardRepository = new InMemoryCreditCardRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new UpdateCreditCardUseCase(creditCardRepository, accountRepository)

    await accountRepository.create({
      id: userId,
      name: 'account-name',
      institution: InstitutionEnum.BRADESCO,
      balance: 0,
      user_id: userId,
    })
  })

  it('should be able to update a creditCard', async () => {
    const creditCard = await creditCardRepository.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: userId,
    })

    const response = await sut.execute({
      id: creditCard.id,
      name: 'Updated Credit Card Name',
      limit: 2000,
      flag: FlagEnum.VISA,
      closingDay: 20,
      dueDay: 20,
      userId,
      accountId: userId,
    })

    expect(response.creditCard).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Updated Credit Card Name',
        limit: 2000,
        flag: FlagEnum.VISA,
        closingDay: 20,
        dueDay: 20,
      }),
    )
  })
  it('should be able to update a creditCard without changing the name', async () => {
    const creditCard = await creditCardRepository.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: userId,
    })

    const response = await sut.execute({
      id: creditCard.id,
      limit: 2000,
      flag: FlagEnum.VISA,
      closingDay: 20,
      dueDay: 20,
      userId,
      accountId: userId,
    })

    expect(response.creditCard).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Credit Card Name',
        limit: 2000,
        flag: FlagEnum.VISA,
        closingDay: 20,
        dueDay: 20,
        account: {
          id: expect.any(String),
          name: 'account-name',
          institution: InstitutionEnum.BRADESCO,
        },
      }),
    )
  })

  it('should be able to update a creditCard without changing the limit, flag, closingDay and dueDay', async () => {
    const creditCard = await creditCardRepository.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: userId,
    })

    const response = await sut.execute({
      id: creditCard.id,
      name: 'Updated Credit Card Name',
      userId,
      accountId: userId,
    })

    expect(response.creditCard).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Updated Credit Card Name',
        limit: 1000,
        flag: FlagEnum.MASTERCARD,
        closingDay: 10,
        dueDay: 10,
      }),
    )
  })

  it('should not be able to update a creditCard with an inexistent user', async () => {
    await expect(
      sut.execute({
        id: 'creditCard-id',
        name: 'Updated Credit Card Name',
        limit: 2000,
        flag: FlagEnum.VISA,
        closingDay: 20,
        dueDay: 20,
        userId: 'non-existing-user-id',
        accountId: userId,
      }),
    ).rejects.toThrow()
  })

  it('should not be able to update a creditCard with an inexistent account', async () => {
    await expect(
      sut.execute({
        id: 'creditCard-id',
        name: 'Updated Credit Card Name',
        limit: 2000,
        flag: FlagEnum.VISA,
        closingDay: 20,
        dueDay: 20,
        userId,
        accountId: 'non-existing-account-id',
      }),
    ).rejects.toThrow()
  })
})
