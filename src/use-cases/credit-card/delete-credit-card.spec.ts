import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteCreditCardUseCase } from './delete-credit-card'
import { FlagEnum } from './create-credit-card'
import { CreditCardNotFoundError } from '../errors/credit-card-not-found-error'

let creditCardRepository: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository
let sut: DeleteCreditCardUseCase

describe('Delete Credit Card Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteCreditCardUseCase(creditCardRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to delete a creditCard', async () => {
    const creditCard = await creditCardRepository.create({
      name: 'Credit Card Name',
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      closingDay: 10,
      dueDay: 10,
      user_id: userId,
      account_id: 'account-id',
    })

    await sut.execute({ creditCardId: creditCard.id })
    await expect(
      sut.execute({ creditCardId: creditCard.id }),
    ).rejects.toBeInstanceOf(CreditCardNotFoundError)
  })

  it('should not be able to delete a non-existing creditCard', async () => {
    await expect(
      sut.execute({ creditCardId: 'non-existing-creditCard-id' }),
    ).rejects.toBeInstanceOf(CreditCardNotFoundError)
  })
})
