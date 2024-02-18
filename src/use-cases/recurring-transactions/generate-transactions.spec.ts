import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { GenerateTransactions } from './generate-transactions'
import { FetchRecurringTransactionsByUserUseCase } from './fetch-recurring-transactions-by-user'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { hash } from 'bcryptjs'
import { TransactionEnum } from '../transactions/create-transaction'
import { FrequencyEnum } from './create-recurring-transaction'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let userRepository: InMemoryUserRepository
let sut: GenerateTransactions

describe('Generate Transactions Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GenerateTransactions(recurringTransactionRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name',
      password_hash: await hash('password', 8),
      type: 'ADMIN',
      organization_id: 'organization-id',
    })
  })

  it('should be able to generate transactions', async () => {
    const fetchRecurringTransactionsByUserUseCase =
      new FetchRecurringTransactionsByUserUseCase(
        recurringTransactionRepository,
        userRepository,
      )

    const recurringTransaction = await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.MONTHLY,
      start_date: new Date(),
      end_date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await fetchRecurringTransactionsByUserUseCase.execute({
      userId,
    })
  })
})
