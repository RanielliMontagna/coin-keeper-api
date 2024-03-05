import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { GenerateTransactions } from './generate-transactions'
import { FetchRecurringTransactionsByUserUseCase } from './fetch-recurring-transactions-by-user'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { hash } from 'bcryptjs'
import { TransactionEnum } from '../transactions/create-transaction'
import { FrequencyEnum } from './create-recurring-transaction'
import { RecurringTransactionNotFoundError } from '../errors/recurring-transaction-not-found-error'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let accountRepository: InMemoryAccountRepository
let sut: GenerateTransactions

describe('Generate Transactions Use Case', () => {
  const userId = 'user-id'
  const accountId = 'account-id'

  const startDate = new Date()

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GenerateTransactions(
      recurringTransactionRepository,
      transactionRepository,
      accountRepository,
    )

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name',
      password_hash: await hash('password', 8),
      type: 'ADMIN',
      organization_id: 'organization-id',
    })

    await accountRepository.create({
      id: accountId,
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })
  })

  it('should not be able to generate transactions for a non-existing recurring transaction', async () => {
    const response = sut.execute({
      recurringTransactionId: 'non-existing-id',
    })

    await expect(response).rejects.toThrowError(
      RecurringTransactionNotFoundError,
    )
  })

  it('should be able to generate weekly transactions', async () => {
    const recurringTransaction = await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.WEEKLY,
      start_date: startDate,
      repeat_amount: 12,
      account_id: accountId,
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      recurringTransactionId: recurringTransaction.id,
    })

    expect(response.createdCount).toBe(12)

    const account = await accountRepository.findById(accountId)

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(100)
    expect(account?.income).toBe(0)
  })

  it('should be able to generate monthly transactions', async () => {
    const recurringTransaction = await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.MONTHLY,
      start_date: startDate,
      repeat_amount: 12,
      account_id: accountId,
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      recurringTransactionId: recurringTransaction.id,
    })

    expect(response.createdCount).toBe(12)

    const account = await accountRepository.findById(accountId)

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(100)
    expect(account?.income).toBe(0)
  })

  it('should be able to generate yearly transactions', async () => {
    const recurringTransaction = await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.YEARLY,
      start_date: startDate,
      repeat_amount: 12,
      account_id: accountId,
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      recurringTransactionId: recurringTransaction.id,
    })

    expect(response.createdCount).toBe(12)

    const account = await accountRepository.findById(accountId)

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(100)
    expect(account?.income).toBe(0)
  })
})
