import { hash } from 'bcryptjs'

import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { GetTransactionsBalanceUseCase } from './get-transactions-balance'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: GetTransactionsBalanceUseCase

describe('Get Transaction Balance Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetTransactionsBalanceUseCase(
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

  it('should be able to get transaction balance', async () => {
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

    expect(response.balance).toEqual(-100)
    expect(response.incomes).toEqual(100)
    expect(response.expenses).toEqual(200)
  })

  it('should not be able to get transaction balance with invalid user', async () => {
    await expect(
      sut.execute({
        userId: 'invalid-user-id',
      }),
    ).rejects.toEqual(new UserNotFoundError())
  })
})
