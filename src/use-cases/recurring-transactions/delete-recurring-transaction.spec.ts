import { InMemoryRecurringTransactionRepository } from '@/repositories/in-memory/in-memory-recurring-transaction-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { DeleteRecurringTransactionUseCase } from './delete-recurring-transaction'
import { UserTypeEnum } from '../users/register-user'
import { TransactionEnum } from '../transactions/create-transaction'
import { FrequencyEnum } from './create-recurring-transaction'
import { RecurringTransactionNotFoundError } from '../errors/recurring-transaction-not-found-error'

let recurringTransactionRepository: InMemoryRecurringTransactionRepository
let userRepository: InMemoryUserRepository
let sut: DeleteRecurringTransactionUseCase

describe('Delete Recurring Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    recurringTransactionRepository =
      new InMemoryRecurringTransactionRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteRecurringTransactionUseCase(recurringTransactionRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to delete a recurring transaction', async () => {
    const recurringTransaction = await recurringTransactionRepository.create({
      title: 'Recurring Transaction Name',
      description: 'Recurring Transaction Description',
      amount: 100,
      type: TransactionEnum.EXPENSE,
      frequency: FrequencyEnum.MONTHLY,
      start_date: new Date(),
      account_id: 'account-id',
      category_id: 'category-id',
      user_id: userId,
    })

    await sut.execute({ recurringTransactionId: recurringTransaction.id })

    await expect(
      sut.execute({ recurringTransactionId: recurringTransaction.id }),
    ).rejects.toBeInstanceOf(RecurringTransactionNotFoundError)
  })

  it('should not be able to delete a recurring transaction that does not exist', async () => {
    await expect(
      sut.execute({ recurringTransactionId: 'invalid-id' }),
    ).rejects.toBeInstanceOf(RecurringTransactionNotFoundError)
  })
})
