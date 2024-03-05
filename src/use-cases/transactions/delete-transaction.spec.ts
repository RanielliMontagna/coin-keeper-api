import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteTransactionUseCase } from './delete-transaction'
import { CreateTransactionUseCase, TransactionEnum } from './create-transaction'
import { TransactionNotFoundError } from '../errors/transaction-not-found-error'
import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository

let createTransactionUseCase: CreateTransactionUseCase
let sut: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  const userId = 'user-id'
  const accountId = 'account-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()

    createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
    )
    sut = new DeleteTransactionUseCase(transactionRepository, accountRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })

    await accountRepository.create({
      id: accountId,
      name: 'Account Name',
      balance: 0,
      expense: 0,
      income: 0,
      user_id: userId,
    })
  })

  it('should be able to delete a expense', async () => {
    const { transaction } = await createTransactionUseCase.execute({
      title: 'Transaction Name',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      isPaid: true,
      accountId: accountId,
      categoryId: 'category-id',
      userId: userId,
    })

    const account = await accountRepository.findById(accountId)

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(100)
    expect(account?.income).toBe(0)

    await sut.execute({ transactionId: transaction.id })

    const accountUpdated = await accountRepository.findById(accountId)

    expect(accountUpdated?.balance).toBe(0)
    expect(accountUpdated?.expense).toBe(0)
    expect(accountUpdated?.income).toBe(0)

    await expect(
      sut.execute({ transactionId: transaction.id }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('should be able to delete a income', async () => {
    const { transaction } = await createTransactionUseCase.execute({
      title: 'Transaction Name',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.INCOME,
      date: new Date(),
      isPaid: true,
      accountId: accountId,
      categoryId: 'category-id',
      userId: userId,
    })

    const account = await accountRepository.findById(accountId)

    expect(account?.balance).toBe(100)
    expect(account?.expense).toBe(0)
    expect(account?.income).toBe(100)

    await sut.execute({ transactionId: transaction.id })

    const accountUpdated = await accountRepository.findById(accountId)

    expect(accountUpdated?.balance).toBe(0)
    expect(accountUpdated?.expense).toBe(0)
    expect(accountUpdated?.income).toBe(0)

    await expect(
      sut.execute({ transactionId: transaction.id }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('should not be able to delete a non-existing transaction', async () => {
    await expect(
      sut.execute({
        transactionId: 'non-existing-transaction-id',
      }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError)
  })
})
