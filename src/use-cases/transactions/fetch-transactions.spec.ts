import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

import { FetchTransactionsUseCase } from './fetch-transactions'
import { TransactionType } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: FetchTransactionsUseCase

describe('Fetch Transactions Use Case', () => {
  const accountId = 'account-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new FetchTransactionsUseCase(transactionRepository, accountRepository)

    await accountRepository.create({
      id: accountId,
      name: 'Account Name',
      balance: 0,
      user_id: 'user-id',
    })
  })

  it('should be able to fetch transactions', async () => {
    await transactionRepository.create({
      title: 'Transaction Name',
      amount: 100,
      type: TransactionType.EXPENSE,
      date: new Date(),
      account_id: accountId,
      category_id: 'category-id',
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
          type: TransactionType.EXPENSE,
          date: expect.any(Date),
          account_id: accountId,
          category_id: 'category-id',
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
})
