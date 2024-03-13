import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'
import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { CreateInvoiceExpenseUseCase } from './create-invoice-expense'
import { UserTypeEnum } from '../users/register-user'
import { FlagEnum } from '../credit-card/create-credit-card'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'

let invoiceRepository = new InMemoryInvoiceRepository()
let creditCardRepository = new InMemoryCreditCardRepository()
let userRepository = new InMemoryUserRepository()
let sut: CreateInvoiceExpenseUseCase

describe('Create Invoice Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'
  const invoiceId = 'invoice-id'

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
        userId,
      }),
    ).rejects.toThrowError(InvoiceNotFoundError)
  })
})
