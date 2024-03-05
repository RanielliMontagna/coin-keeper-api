import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

import { MarkTransactionAsPaidUseCase } from './mark-transaction-as-paid'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: MarkTransactionAsPaidUseCase

describe('Make Transaction As Paid Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new MarkTransactionAsPaidUseCase(
      transactionRepository,
      accountRepository,
    )

    await accountRepository.create({
      id: 'account-id',
      name: 'Account Name',
      balance: 5000,
      expense: 5000,
      income: 10000,
      user_id: userId,
    })
  })

  it('should be able to mark a expense transaction as paid', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      is_paid: false,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      transactionId: transaction.id,
      userId,
    })

    expect(response).toEqual({ id: transaction.id, isPaid: true })

    const account = await accountRepository.findById('account-id')

    expect(account?.balance).toBe(4900)
    expect(account?.expense).toBe(5100)
  })

  it('should be able to mark a income transaction as paid', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.INCOME,
      date: new Date(),
      is_paid: false,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    const response = await sut.execute({
      transactionId: transaction.id,
      userId,
    })

    expect(response).toEqual({ id: transaction.id, isPaid: true })

    const account = await accountRepository.findById('account-id')

    expect(account?.balance).toBe(5100)
    expect(account?.income).toBe(10100)
  })

  it('should not be able to mark a transaction as paid if it does not exist', async () => {
    await expect(
      sut.execute({ transactionId: 'invalid-id', userId }),
    ).rejects.toThrowError(TransactionNotFoundError)
  })

  it('should not be able to mark a transaction as paid if it does not belong to the user', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Title',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      is_paid: false,
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: 'another-user-id',
    })

    await expect(
      sut.execute({ transactionId: transaction.id, userId }),
    ).rejects.toThrowError(TransactionNotFoundError)
  })

  describe('shout not be able to mark a transaction as paid if the account does not exist', () => {
    it('should not be able to mark a transaction as paid if the account does not exist', async () => {
      const transaction = await transactionRepository.create({
        title: 'Transaction Title',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionEnum.EXPENSE,
        date: new Date(),
        is_paid: false,
        account_id: 'invalid-account-id',
        category_id: 'category-id',
        user_id: userId,
      })

      await expect(
        sut.execute({ transactionId: transaction.id, userId }),
      ).rejects.toThrowError()
    })
  })
})
