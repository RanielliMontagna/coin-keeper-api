import dayjs from 'dayjs'

import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryInvoiceRepository } from '@/repositories/in-memory/in-memory-invoice-repository'
import { InMemoryCreditCardRepository } from '@/repositories/in-memory/in-memory-credit-card-repository'

import { CreateInvoiceUseCase, StatusInvoiceEnum } from './create-invoice'
import { GetInvoiceByDateUseCase } from './get-invoice-by-date'

import { UserTypeEnum } from '../users/register-user'
import { FlagEnum } from '../credit-card/create-credit-card'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'

let invoiceRepository: InMemoryInvoiceRepository
let creditCardRepository: InMemoryCreditCardRepository
let userRepository: InMemoryUserRepository

let createInvoiceUseCase: CreateInvoiceUseCase

let sut: GetInvoiceByDateUseCase

describe('Get invoice By Date Use Case', () => {
  const userId = 'user-id'
  const creditCardId = 'credit-card-id'

  beforeEach(async () => {
    invoiceRepository = new InMemoryInvoiceRepository()
    creditCardRepository = new InMemoryCreditCardRepository()
    userRepository = new InMemoryUserRepository()

    createInvoiceUseCase = new CreateInvoiceUseCase(
      invoiceRepository,
      creditCardRepository,
      userRepository,
    )

    sut = new GetInvoiceByDateUseCase(invoiceRepository, userRepository)

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

  it('should be able to get invoice by date', async () => {
    await createInvoiceUseCase.execute({
      closingDate: dayjs('2023-02-01').toDate(),
      dueDate: dayjs('2023-02-10').toDate(),
      userId,
      creditCardId,
    })

    const response = await sut.execute({ month: 1, year: 2023, userId })

    expect(response.invoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: StatusInvoiceEnum.OPEN,
        paidAmount: 0,
        partialAmount: 0,
        dueDate: dayjs('2023-02-10').toDate(),
        closingDate: dayjs('2023-02-01').toDate(),
        creditCard: {
          id: expect.any(String),
          name: expect.any(String),
          flag: FlagEnum.VISA,
          limit: 1000,
        },
      }),
    )
  })

  it('should be able to get invoice by date with credit card', async () => {
    await createInvoiceUseCase.execute({
      closingDate: dayjs('2023-02-01').toDate(),
      dueDate: dayjs('2023-02-10').toDate(),
      userId,
      creditCardId,
    })

    const response = await sut.execute({
      month: 1,
      year: 2023,
      userId,
      creditCardId,
    })

    expect(response.invoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: StatusInvoiceEnum.OPEN,
        paidAmount: 0,
        partialAmount: 0,
        dueDate: dayjs('2023-02-10').toDate(),
        closingDate: dayjs('2023-02-01').toDate(),
        creditCard: {
          id: expect.any(String),
          name: expect.any(String),
          flag: FlagEnum.VISA,
          limit: 1000,
        },
      }),
    )
  })

  it('should be able to get invoice by date without year', async () => {
    const januaryThisYear = dayjs().month(0).year(new Date().getFullYear())

    await createInvoiceUseCase.execute({
      closingDate: januaryThisYear.toDate(),
      dueDate: januaryThisYear.add(9, 'day').toDate(),
      userId,
      creditCardId,
    })

    const response = await sut.execute({
      month: 1,
      userId,
    })

    expect(response.invoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: StatusInvoiceEnum.OPEN,
        paidAmount: 0,
        partialAmount: 0,
        dueDate: januaryThisYear.add(9, 'day').toDate(),
        closingDate: januaryThisYear.toDate(),
        creditCard: {
          id: expect.any(String),
          name: expect.any(String),
          flag: FlagEnum.VISA,
          limit: 1000,
        },
      }),
    )
  })

  it('should not be able to get invoice by date if user does not exist', async () => {
    await expect(
      sut.execute({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        userId: 'invalid-user-id',
      }),
    ).rejects.toThrowError(UserNotFoundError)
  })

  it('return null if invoice does not exist', async () => {
    const response = await sut.execute({ month: 1, year: 2021, userId })

    expect(response.invoice).toBeNull()
  })
})
