import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { FetchTransactionsByUserUseCase } from './fetch-transactions-by-user'
import { TransactionType } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: FetchTransactionsByUserUseCase

describe('Fetch Transactions By User Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchTransactionsByUserUseCase(
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

  it('should be able to fetch transactions by user', async () => {
    await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionType.EXPENSE,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      userId,
    })

    expect(response.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name',
          amount: 100,
          type: TransactionType.EXPENSE,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
      ]),
    )
  })

  it('should be able to fetch transactions by user with infinite scroll', async () => {
    for (let i = 0; i < 30; i++) {
      await transactionRepository.create({
        title: `Transaction Name ${i}`,
        amount: 100,
        type: TransactionType.EXPENSE,
        date: new Date(),
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
      })
    }

    const response = await sut.execute({
      userId,
      options: { page: 2 },
    })

    expect(response.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name 20',
          amount: 100,
          type: TransactionType.EXPENSE,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
        expect.not.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name 0',
          amount: 100,
          type: TransactionType.EXPENSE,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
      ]),
    )
  })

  it('should not be able to fetch transactions with an inexistent user', async () => {
    await expect(
      sut.execute({
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
