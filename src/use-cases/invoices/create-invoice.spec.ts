import dayjs from 'dayjs'

import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { CreateInvoiceUseCase, StatusInvoiceEnum } from './create-invoice'
import { UserTypeEnum } from '../users/register-user'
import { FlagEnum } from '../credit-card/create-credit-card'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { CreditCardNotFoundError } from '../errors/credit-card-not-found-error'

let invoiceRepository: InMemoryInvoiceRepository
let creditCardRepository: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository
let sut: CreateInvoiceUseCase

describe('Create Invoice Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'

  beforeEach(async () => {
    invoiceRepository = new InMemoryInvoiceRepository()
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateInvoiceUseCase(
      invoiceRepository,
      creditCardRepository,
      userRepository,
    )

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
      flag: FlagEnum.MASTERCARD,
      user_id: userId,
      account_id: 'account-id',
    })
  })

  it('should be able to create a new invoice', async () => {
    const response = await sut.execute({
      closingDate: dayjs().startOf('month').toDate(),
      dueDate: dayjs().startOf('month').add(10, 'day').toDate(),
      userId,
      creditCardId,
    })

    expect(response.invoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        closingDate: dayjs().startOf('month').toDate(),
        dueDate: dayjs().startOf('month').add(10, 'day').toDate(),
        status: StatusInvoiceEnum.OPEN,
        creditCardId,
        userId,
      }),
    )
  })

  it('should not be able to create a new invoice with an inexistent user', async () => {
    await expect(
      sut.execute({
        closingDate: dayjs().startOf('month').toDate(),
        dueDate: dayjs().startOf('month').add(10, 'day').toDate(),
        userId: 'inexistent-user-id',
        creditCardId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new invoice with an inexistent credit card', async () => {
    await expect(
      sut.execute({
        closingDate: dayjs().startOf('month').toDate(),
        dueDate: dayjs().startOf('month').add(10, 'day').toDate(),
        userId,
        creditCardId: 'inexistent-credit-card-id',
      }),
    ).rejects.toBeInstanceOf(CreditCardNotFoundError)
  })
})
