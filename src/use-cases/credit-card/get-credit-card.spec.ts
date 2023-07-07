import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

import { GetCreditCardUseCase } from './get-credit-card'
import { FlagEnum } from './create-credit-card'

let creditCardRepository: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository
let sut: GetCreditCardUseCase

describe('Get Credit Card Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetCreditCardUseCase(creditCardRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to get a creditCard', async () => {
    const creditCard = await creditCardRepository.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: 'account-id',
    })

    const response = await sut.execute({
      creditCardId: creditCard.id,
      userId,
    })

    expect(response.creditCard).toEqual(
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
          institution: expect.any(String),
        },
      }),
    )
  })

  it('should not be able to get a creditCard with an inexistent user', async () => {
    await expect(
      sut.execute({
        creditCardId: 'creditCard-id',
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get a non-existing creditCard', async () => {
    await expect(
      sut.execute({
        creditCardId: 'non-existing-creditCard-id',
        userId,
      }),
    ).rejects.toBeInstanceOf(CreditCardNotFoundError)
  })
})
