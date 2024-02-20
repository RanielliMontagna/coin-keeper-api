import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { FetchTransactionsByUserUseCase } from './fetch-transactions-by-user'
import { TransactionEnum } from './create-transaction'

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
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      is_paid: true,
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
          type: TransactionEnum.EXPENSE,
          isPaid: true,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
      ]),
    )
  })

  it('should be able to fetch transactions with date filter', async () => {
    const transactionBase = {
      title: 'Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    }

    await transactionRepository.create({
      ...transactionBase,
      date: new Date('2021-01-01'),
    })

    await transactionRepository.create({
      ...transactionBase,
      date: new Date('2023-01-02'),
    })

    const response = await sut.execute({
      userId,
      options: { date: new Date('2021-01-01') },
    })

    expect(response.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name',
          amount: 100,
          type: TransactionEnum.EXPENSE,
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
        type: TransactionEnum.EXPENSE,
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
          type: TransactionEnum.EXPENSE,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
        expect.not.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name 0',
          amount: 100,
          type: TransactionEnum.EXPENSE,
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

  it('should be able to fetch transactions previously deleted', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    await transactionRepository.delete(transaction.id)

    const response = await sut.execute({ userId })

    expect(response.transactions).not.toContainEqual(
      expect.objectContaining({
        id: transaction.id,
      }),
    )
  })
})
