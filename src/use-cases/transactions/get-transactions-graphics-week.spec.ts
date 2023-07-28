import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { GetTransactionsGraphicsWeekUseCase } from './get-transactions-graphics-week'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: GetTransactionsGraphicsWeekUseCase

describe('Get Transaction Graphics Week Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetTransactionsGraphicsWeekUseCase(
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

  it('should be able to get transaction graphics week', async () => {
    for (let i = 1; i <= 2; i++) {
      await transactionRepository.create({
        title: `Transaction Name ${i + 1}`,
        amount: i * 100,
        type: i % 2 === 0 ? TransactionEnum.EXPENSE : TransactionEnum.INCOME,
        date: new Date(),
        account_id: 'account-id',
        category_id: 'category-id',
        user_id: userId,
      })
    }

    const response = await sut.execute({ userId })

    expect(response.week).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          balance: -100,
          expenses: 200,
          incomes: 100,
        }),
      ]),
    )
  })

  it('should not be able to get transaction graphics week with user not found', async () => {
    await expect(
      sut.execute({ userId: 'user-id-not-found' }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get transaction graphics week of deleted transactions', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
      deleted_at: new Date(),
    })
    await transactionRepository.delete(transaction.id)

    const response = await sut.execute({ userId })

    expect.objectContaining({
      balance: -100,
      expenses: 100,
      incomes: 0,
    }),
      expect(response.week).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            balance: -100,
            expenses: 100,
            incomes: 0,
          }),
        ]),
      )
  })
})
