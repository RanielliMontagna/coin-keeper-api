import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'

import {
  CreateRecurringTransactionUseCase,
  FrequencyEnum,
} from './create-recurring-transaction'
import { TransactionEnum } from '../transactions/create-transaction'

import { WeeklyRecurringTransactionsError } from '@/use-cases/errors/weekly-recurring-transactions-error'
import { MonthlyRecurringTransactionsError } from '@/use-cases/errors/monthly-recurring-transactions-error'
import { YearlyRecurringTransactionsError } from '@/use-cases/errors/yearly-recurring-transactions-error'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: CreateRecurringTransactionUseCase

describe('Create Recurring Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new CreateRecurringTransactionUseCase(
      recurringTransactionRepository,
      transactionRepository,
      accountRepository,
    )

    await accountRepository.create({
      id: 'account-id',
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })
  })

  it('should be able to create a new recurring transaction', async () => {
    const response = await sut.execute({
      title: 'Recurring Transaction Title',
      description: 'Recurring Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      accountId: 'account-id',
      categoryId: 'category-id',
      userId,
      frequency: FrequencyEnum.MONTHLY,
      startDate: new Date(),
      repeatAmount: 12,
    })

    expect(response.recurringTransaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Recurring Transaction Title',
        description: 'Recurring Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        frequency: FrequencyEnum.MONTHLY,
        start_date: expect.any(Date),
      }),
    )
  })

  it('should be able to create a new recurring transaction without description', async () => {
    const response = await sut.execute({
      title: 'Recurring Transaction Title',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      accountId: 'account-id',
      categoryId: 'category-id',
      userId,
      frequency: FrequencyEnum.MONTHLY,
      startDate: new Date('2022-01-01'), // '2022-01-01'
      repeatAmount: 12,
    })

    expect(response.recurringTransaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Recurring Transaction Title',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        frequency: FrequencyEnum.MONTHLY,
        start_date: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a new recurring transaction with an invalid account', async () => {
    await expect(
      sut.execute({
        title: 'Recurring Transaction Title',
        description: 'Recurring Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        accountId: 'invalid-account-id',
        categoryId: 'category-id',
        userId,
        frequency: FrequencyEnum.MONTHLY,
        startDate: new Date(),
        repeatAmount: 12,
      }),
    ).rejects.toThrow('Account not found')
  })

  it('should not be able to create a new recurring weekly transaction with less than 2 weeks', async () => {
    await expect(
      sut.execute({
        title: 'Recurring Transaction Title',
        description: 'Recurring Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        accountId: 'account-id',
        categoryId: 'category-id',
        userId,
        frequency: FrequencyEnum.WEEKLY,
        startDate: new Date('2022-01-01'), // '2022-01-01
        repeatAmount: 1,
      }),
    ).rejects.toThrowError(WeeklyRecurringTransactionsError)
  })

  it('should be able to create a new recurring weekly transaction with more than 2 weeks', async () => {
    await expect(
      sut.execute({
        title: 'Recurring Transaction Title',
        description: 'Recurring Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        accountId: 'account-id',
        categoryId: 'category-id',
        userId,
        frequency: FrequencyEnum.MONTHLY,
        startDate: new Date('2022-01-01'), // '2022-01-01
        repeatAmount: 1,
      }),
    ).rejects.toThrowError(MonthlyRecurringTransactionsError)
  })

  it('should be able to create a new recurring yearly transaction', async () => {
    await expect(
      sut.execute({
        title: 'Recurring Transaction Title',
        description: 'Recurring Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        accountId: 'account-id',
        categoryId: 'category-id',
        userId,
        frequency: FrequencyEnum.YEARLY,
        startDate: new Date('2022-01-01'), // '2022-01-01
        repeatAmount: 1,
      }),
    ).rejects.toThrowError(YearlyRecurringTransactionsError)
  })
})
