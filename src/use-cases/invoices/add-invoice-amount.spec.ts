import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { AddInvoiceAmountUseCase } from './add-invoice-amount'
import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { UserTypeEnum } from '../users/register-user'
import { FlagEnum } from '../credit-card/create-credit-card'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'
import { AmountExceedsCreditCardLimitError } from '../errors/amount-exceeds-credit-card-limit-error'

let invoiceRepository = new InMemoryInvoiceRepository()
let creditCardRepository = new InMemoryCreditCardRepository()
let userRepository = new InMemoryUserRepository()
let sut: AddInvoiceAmountUseCase

describe('Add Invoice Amount Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'
  const invoiceId = 'invoice-id'

  beforeEach(async () => {
    invoiceRepository = new InMemoryInvoiceRepository()
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new AddInvoiceAmountUseCase(invoiceRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })

    await creditCardRepository.create({
      id: creditCardId,
      name: 'Credit Card Name',
      closingDay: 1,
      dueDay: 10,
      limit: 1000,
      flag: FlagEnum.MASTERCARD,
      user_id: userId,
      account_id: 'account-id',
    })

    await invoiceRepository.create({
      id: invoiceId,
      closingDate: new Date(),
      dueDate: new Date(),
      credit_card_id: creditCardId,
      user_id: userId,
    })
  })

  it('should be able to add a new invoice amount', async () => {
    const { newPartialAmount } = await sut.execute({
      amount: 100,
      invoiceId,
      userId,
    })

    expect(newPartialAmount).toBe(100)
  })

  it('should not be able to add a new invoice amount if user does not exist', async () => {
    await expect(
      sut.execute({ amount: 100, invoiceId, userId: 'invalid-user-id' }),
    ).rejects.toThrowError(UserNotFoundError)
  })

  it('should not be able to add a new invoice amount if invoice does not exist', async () => {
    await expect(
      sut.execute({ amount: 100, invoiceId: 'invalid-invoice-id', userId }),
    ).rejects.toThrowError(InvoiceNotFoundError)
  })

  it('should not be able to add a new invoice amount if amount exceeds credit card limit', async () => {
    await expect(
      sut.execute({ amount: 1001, invoiceId, userId }),
    ).rejects.toThrowError(AmountExceedsCreditCardLimitError)
  })
})
