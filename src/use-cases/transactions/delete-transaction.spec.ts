import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteTransactionUseCase } from './delete-transaction'
import { TransactionEnum } from './create-transaction'
import { TransactionNotFoundError } from '../errors/transaction-not-found-error'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteTransactionUseCase(transactionRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to delete a expense', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    await sut.execute({ transactionId: transaction.id })
    await expect(
      sut.execute({ transactionId: transaction.id }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError)
  })

  it('should be able to delete a income', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionEnum.INCOME,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    await sut.execute({ transactionId: transaction.id })
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
