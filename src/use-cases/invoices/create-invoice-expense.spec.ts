import { UserTypeEnum } from '../users/register-user'
import { FlagEnum } from '../credit-card/create-credit-card'
import { StatusInvoiceEnum } from './create-invoice'

import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryCategoryRepository } from '@/repositories/in-memory/in-memory-category-repository'
import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotOpenError } from '@/use-cases/errors/invoice-not-open-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { AmountExceedsCreditCardLimitError } from '@/use-cases/errors/amount-exceeds-credit-card-limit-error'

import { CreateInvoiceExpenseUseCase } from './create-invoice-expense'

let invoiceRepository = new InMemoryInvoiceRepository()
let creditCardRepository = new InMemoryCreditCardRepository()
let categoryRepository = new InMemoryCategoryRepository()
let userRepository = new InMemoryUserRepository()
let sut: CreateInvoiceExpenseUseCase

describe('Create Invoice Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'
  const invoiceId = 'invoice-id'
  const categoryId = 'category-id'

  beforeEach(async () => {
    invoiceRepository = new InMemoryInvoiceRepository()
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateInvoiceExpenseUseCase(invoiceRepository, userRepository)

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

    await invoiceRepository.create({
      id: invoiceId,
      closingDate: new Date(),
      dueDate: new Date(),
      credit_card_id: creditCardId,
      user_id: userId,
    })
  })

  it('should be able to create a new invoice expense', async () => {
    const { invoiceExpense } = await sut.execute({
      title: 'Title',
      description: 'Description',
      amount: 100,
      date: new Date(),
      categoryId,
      invoiceId,
      userId,
    })

    expect(invoiceExpense).toEqual({
      id: invoiceExpense.id,
      title: 'Title',
      description: 'Description',
      amount: 100,
      date: expect.any(Date),
      invoiceId,
      userId,
    })
  })

  it('should not be able to create a new invoice expense with invalid user', async () => {
    await expect(
      sut.execute({
        title: 'Title',
        description: 'Description',
        amount: 100,
        date: new Date(),
        categoryId,
        invoiceId,
        userId: 'invalid-user-id',
      }),
    ).rejects.toThrowError(UserNotFoundError)
  })

  it('should not be able to create a new invoice expense with invalid invoice', async () => {
    await expect(
      sut.execute({
        title: 'Title',
        description: 'Description',
        amount: 100,
        date: new Date(),
        invoiceId: 'invalid-invoice-id',
        categoryId,
        userId,
      }),
    ).rejects.toThrowError(InvoiceNotFoundError)
  })

  it('should not be able to create a new invoice expense if invoice is not open', async () => {
    await invoiceRepository.create({
      id: 'closed-invoice-id',
      closingDate: new Date(),
      dueDate: new Date(),
      credit_card_id: creditCardId,
      user_id: userId,
      status: StatusInvoiceEnum.CLOSED,
    })

    await expect(
      sut.execute({
        title: 'Title',
        description: 'Description',
        amount: 100,
        date: new Date(),
        categoryId,
        invoiceId: 'closed-invoice-id',
        userId,
      }),
    ).rejects.toThrowError(InvoiceNotOpenError)
  })

  it('should not be able to create a new invoice if limit is exceeded', async () => {
    await expect(
      sut.execute({
        title: 'Title',
        description: 'Description',
        amount: 10000,
        date: new Date(),
        categoryId,
        invoiceId,
        userId,
      }),
    ).rejects.toThrowError(AmountExceedsCreditCardLimitError)
  })
})
