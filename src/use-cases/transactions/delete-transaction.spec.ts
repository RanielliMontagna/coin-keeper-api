import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteTransactionUseCase } from './delete-transaction'
import { TransactionType } from './create-transaction'
import { TransactionNotFoundError } from '../errors/transaction-not-found-error'

let transactionRepository: InMemoryTransactionRepository
let userRepository: InMemoryUserRepository
let sut: DeleteTransactionUseCase

describe('Update Transaction Use Case', () => {
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
    })
  })

  it('should be able to delete a transaction', async () => {
    const transaction = await transactionRepository.create({
      title: 'Transaction Name',
      description: 'Transaction Description',
      amount: 100,
      type: TransactionType.EXPENSE,
      date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
    })

    const response = await sut.execute({
      transactionId: transaction.id,
    })

    expect(response.transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction Name',
        description: 'Transaction Description',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: expect.any(Date),
        account_id: 'account-id',
        category_id: 'category-id',
      }),
    )
  })

  it('should not be able to delete a non-existing transaction', async () => {
    await expect(
      sut.execute({
        transactionId: 'non-existing-transaction-id',
      }),
    ).rejects.toBeInstanceOf(TransactionNotFoundError)
  })
})
