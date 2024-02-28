import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { MarkTransactionAsPaidUseCase } from './mark-transaction-as-paid'
import { TransactionEnum } from './create-transaction'
import { TransactionNotFoundError } from '../errors/transaction-not-found-error'

let transactionRepository: InMemoryTransactionRepository
let sut: MarkTransactionAsPaidUseCase

describe('Make Transaction As Paid Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    sut = new MarkTransactionAsPaidUseCase(transactionRepository)
  })

  it('should be able to mark a transaction as paid', async () => {
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
})
