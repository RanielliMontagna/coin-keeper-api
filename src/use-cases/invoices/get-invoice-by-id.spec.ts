import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { GetInvoiceByIdUseCase } from './get-invoice-by-id'
import { StatusInvoiceEnum } from './create-invoice'
import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { FlagEnum } from '../credit-card/create-credit-card'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'

let invoiceRepository: InMemoryInvoiceRepository
let creditCardRepository: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository

let sut: GetInvoiceByIdUseCase

describe('Get Invoice By Id Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'

  beforeEach(async () => {
    invoiceRepository = new InMemoryInvoiceRepository()
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()

    sut = new GetInvoiceByIdUseCase(invoiceRepository, userRepository)

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

  it('should be able to get invoice by id', async () => {
    const invoice = await invoiceRepository.create({
      status: StatusInvoiceEnum.OPEN,
      paidAmount: 0,
      partialAmount: 0,
      dueDate: new Date('2021-01-10'),
      closingDate: new Date('2021-01-01'),
      credit_card_id: 'credit-card-id',
      user_id: userId,
    })

    const response = await sut.execute({
      userId,
      invoiceId: invoice.id,
    })

    expect(response.invoice).toEqual({
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: expect.any(String),
        name: expect.any(String),
        flag: FlagEnum.VISA,
        limit: 1000,
      },
    })
  })

  it('should not be able to get invoice by id with invalid user', async () => {
    await expect(
      sut.execute({
        userId: 'invalid-user-id',
        invoiceId: 'invoice-id',
      }),
    ).rejects.toThrowError(UserNotFoundError)
  })

  it('should not be able to get invoice by id with invalid invoice', async () => {
    await expect(
      sut.execute({
        userId,
        invoiceId: 'invalid-invoice-id',
      }),
    ).rejects.toThrowError(InvoiceNotFoundError)
  })
})
