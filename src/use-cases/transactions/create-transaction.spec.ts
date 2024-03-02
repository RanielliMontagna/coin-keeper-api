import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { CreateTransactionUseCase, TransactionEnum } from './create-transaction'
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

  it('should be able to create a new expense', async () => {
    const response = await sut.execute({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      isPaid: true,
      accountId: 'account-id',
      categoryId: 'category-id',
      userId,
    })

    expect(response.transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        date: expect.any(Date),
        is_paid: true,
        account_id: 'account-id',
        category_id: 'category-id',
      }),
    )

    const account = await accountRepository.findById('account-id')

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(100)
    expect(account?.income).toBe(0)
  })

  it('should be able to create a new income', async () => {
    const response = await sut.execute({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.INCOME,
      isPaid: true,
      date: new Date(),
      accountId: 'account-id',
      categoryId: 'category-id',
      userId,
    })

    expect(response.transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionEnum.INCOME,
        date: expect.any(Date),
        is_paid: true,
        account_id: 'account-id',
        category_id: 'category-id',
      }),
    )

    const account = await accountRepository.findById('account-id')

    expect(account?.balance).toBe(100)
    expect(account?.income).toBe(100)
    expect(account?.expense).toBe(0)
  })

  it('should not be able to create a new transaction with an inexistent account', async () => {
    await expect(
      sut.execute({
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        date: new Date(),
        accountId: 'inexistent-account-id',
        categoryId: 'category-id',
        userId,
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })
})
