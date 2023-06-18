import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { CreateTransactionUseCase, TransactionType } from './create-transaction'
import { UserTypeEnum } from '../users/register-user'
import { AccountNotFoundError } from '../errors/account-not-found-error'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new CreateTransactionUseCase(transactionRepository, accountRepository)

    await accountRepository.create({
      id: 'account-id',
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })
  })

  it('should be able to create a new transaction', async () => {
    const response = await sut.execute({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionType.EXPENSE,
      date: new Date(),
      accountId: 'account-id',
      categoryId: 'category-id',
    })

    expect(response.transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: expect.any(Date),
        account_id: 'account-id',
        category_id: 'category-id',
      }),
    )
  })

  it('should not be able to create a new transaction with an inexistent account', async () => {
    await expect(
      sut.execute({
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: new Date(),
        accountId: 'inexistent-account-id',
        categoryId: 'category-id',
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })
})
