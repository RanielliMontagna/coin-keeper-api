import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { FetchCreditCardsUseCase } from './fetch-credit-cards'
import { FlagEnum } from './create-credit-card'

let creditCard: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository
let sut: FetchCreditCardsUseCase

describe('Fetch Categories Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    creditCard = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchCreditCardsUseCase(creditCard, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to fetch creditCards', async () => {
    await creditCard.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: 'account-id',
    })

    const response = await sut.execute({ userId })

    expect(response.creditCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Credit Card Name',
          limit: 1000,
          flag: FlagEnum.MASTERCARD,
          closingDay: 10,
          dueDay: 10,
          account: {
            id: expect.any(String),
            name: 'Account Name',
            institution: expect.any(Number),
          },
        }),
      ]),
    )
  })

  it('should not be able to fetch creditCards if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'invalid-user-id',
      }),
    ).rejects.toThrow(new Error('User not found'))
  })
})
