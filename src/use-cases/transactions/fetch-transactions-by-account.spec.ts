import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

import { FetchTransactionsByAccountUseCase } from './fetch-transactions-by-account'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: FetchTransactionsByAccountUseCase

describe('Fetch Transactions Use Case By Account', () => {
  const accountId = 'account-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new FetchTransactionsByAccountUseCase(
      transactionRepository,
      accountRepository,
    )

    await accountRepository.create({
      id: accountId,
      name: 'Account Name',
      balance: 0,
      user_id: 'user-id',
    })
  })

  it('should be able to fetch transactions by account', async () => {
    await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      account_id: accountId,
      category_id: 'category-id',
      user_id: 'user-id',
    })

    const response = await sut.execute({
      accountId,
    })

    expect(response.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Transaction Name',
          amount: 100,
          type: TransactionEnum.EXPENSE,
          date: expect.any(Date),
        }),
      ]),
    )
  })

  it('should not be able to fetch transactions with an inexistent account', async () => {
    await expect(
      sut.execute({
        accountId: 'inexistent-account-id',
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })

  it('should not be able to fetch transactions previously deleted', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      account_id: accountId,
      category_id: 'category-id',
      user_id: 'user-id',
    })

    await transactionRepository.delete(transaction.id)

    const response = await sut.execute({ accountId })

    expect(response.transactions).toEqual([])
  })
})
