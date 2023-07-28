import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { GetLatestTransactionsByUserUseCase } from './get-latest-transactions'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: GetLatestTransactionsByUserUseCase

describe('Fetch Transactions By User Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetLatestTransactionsByUserUseCase(
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
    for (let i = 0; i < 10; i++) {
      await transactionRepository.create({
        title: `Transaction Name ${i + 1}`,
        amount: 100,
        type: TransactionEnum.EXPENSE,
        date: new Date(),
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
      })
    }

    const response = await sut.execute({ userId })

    expect(response.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name 9',
          amount: 100,
          type: TransactionEnum.EXPENSE,
          date: expect.any(Date),
          account: expect.objectContaining({ id: 'account-id' }),
          category: expect.objectContaining({ id: 'category-id' }),
        }),
      ]),
    )
  })

  it('should not be able to fetch transactions by user if user does not exist', async () => {
    await expect(sut.execute({ userId: 'invalid-user-id' })).rejects.toThrow(
      new UserNotFoundError(),
    )
  })

  it('shout not be able to fetch latest transactions of deleted transactions', async () => {
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

    expect(response.transactions).toEqual([])
  })
})
