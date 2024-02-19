import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { FetchRecurringTransactionsByUserUseCase } from './fetch-recurring-transactions-by-user'
import { hash } from 'bcryptjs'
import { TransactionEnum } from '../transactions/create-transaction'
import { FrequencyEnum } from './create-recurring-transaction'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let userRepository: InMemoryUserRepository
let sut: FetchRecurringTransactionsByUserUseCase

describe('Fetch Recurring Transactions By User Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchRecurringTransactionsByUserUseCase(
      recurringTransactionRepository,
      userRepository,
    )

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name',
      password_hash: await hash('password', 8),
      type: 'ADMIN',
      organization_id: 'organization-id',
    })
  })

  it('should be able to fetch recurring transactions by user', async () => {
    await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.MONTHLY,
      start_date: new Date(),
      repeat_amount: 12,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({ userId })

    expect(response.recurringTransactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Recurring Transaction Name',
          amount: 100,
          type: TransactionEnum.EXPENSE,
          frequency: FrequencyEnum.MONTHLY,
          startDate: expect.any(Date),
          repeatAmount: 12,
        }),
      ]),
    )
  })

  it('should be able to fetch all recurring transactions by user', async () => {
    for (let i = 0; i < 20; i++) {
      await recurringTransactionRepository.create({
        title: `Recurring Transaction Name ${i}`,
        amount: 100,
        type: TransactionEnum.EXPENSE,
        frequency: FrequencyEnum.MONTHLY,
        start_date: new Date(),
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
        repeat_amount: 12,
      })
    }

    const response = await sut.execute({
      userId,
      options: {
        all: true,
      },
    })

    expect(response.recurringTransactions.length).toBe(20)
  })

  it('should be able to fetch recurring transactions by user with infinite scroll', async () => {
    for (let i = 0; i < 20; i++) {
      await recurringTransactionRepository.create({
        title: `Recurring Transaction Name ${i}`,
        amount: 100,
        type: TransactionEnum.EXPENSE,
        frequency: FrequencyEnum.MONTHLY,
        start_date: new Date(),
        repeat_amount: 12,
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
      })
    }

    const response = await sut.execute({
      userId,
      options: {
        page: 2,
      },
    })

    expect(response.recurringTransactions.length).toBe(5)
  })

  it('should not be able to fetch recurring transactions by user if user does not exist', async () => {
    await expect(sut.execute({ userId: 'invalid-user-id' })).rejects.toThrow()
  })

  it('should be able to fetch transactions without deleted transactions', async () => {
    await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.MONTHLY,
      start_date: new Date(),
      repeat_amount: 12,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    await recurringTransactionRepository.delete('1')

    const response = await sut.execute({ userId })

    expect(response.recurringTransactions).toEqual([])
  })
})
