import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { GetTransactionsGraphicsYearUseCase } from './get-transactions-graphics-year'
import { TransactionType } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: GetTransactionsGraphicsYearUseCase

describe('Get Transaction Graphics Week Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetTransactionsGraphicsYearUseCase(
      transactionRepository,
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

  it('should be able to get transaction graphics year', async () => {
    for (let i = 1; i <= 2; i++) {
      await transactionRepository.create({
        title: `Transaction Name ${i + 1}`,
        amount: i * 100,
        type: i % 2 === 0 ? TransactionType.EXPENSE : TransactionType.INCOME,
        date: new Date(),
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
      })
    }

    const response = await sut.execute({ userId })

    expect(response.year).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          balance: -100,
          expenses: 200,
          incomes: 100,
        }),
      ]),
    )
  })

  it('should not be able to get transaction graphics year with user not found', async () => {
    await expect(
      sut.execute({ userId: 'user-id-not-found' }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
