import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'

import {
  CreateRecurringTransactionUseCase,
  FrequencyEnum,
} from './create-recurring-transaction'
import { TransactionEnum } from '../transactions/create-transaction'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: CreateRecurringTransactionUseCase

describe('Create Recurring Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new CreateRecurringTransactionUseCase(
      recurringTransactionRepository,
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

  it('should be able to create a new recurring transaction with end date and without description', async () => {
    const response = await sut.execute({
      title: 'Recurring Transaction Title',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      accountId: 'account-id',
      categoryId: 'category-id',
      userId,
      frequency: FrequencyEnum.MONTHLY,
      startDate: new Date(),
      endDate: new Date(),
    })

    expect(response.recurringTransaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Recurring Transaction Title',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        frequency: FrequencyEnum.MONTHLY,
        start_date: expect.any(Date),
        end_date: expect.any(Date),
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
      }),
    ).rejects.toThrow('Account not found')
  })
})
