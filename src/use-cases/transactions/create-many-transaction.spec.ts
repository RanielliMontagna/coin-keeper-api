import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryTransactionRepository } from '@/repositories/in-memory/in-memory-transaction-repository'
import { CreateManyTransactionUseCase } from './create-many-transaction'
import { TransactionEnum } from './create-transaction'

let transactionRepository: InMemoryTransactionRepository
let accountRepository: InMemoryAccountRepository
let sut: CreateManyTransactionUseCase

describe('Create Many Transaction Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    transactionRepository = new InMemoryTransactionRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new CreateManyTransactionUseCase(
      transactionRepository,
      accountRepository,
    )

    await accountRepository.create({
      id: 'account-id',
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })
  })

  it('should be able to create many transactions', async () => {
    const response = await sut.execute({
      transactions: [
        {
          title: 'Transaction 1',
          description: 'Transaction Description 1',
          amount: 100,
          type: TransactionEnum.INCOME,
          account_id: 'account-id',
          category_id: 'category-id',
          user_id: userId,
          date: new Date(),
          is_paid: true,
        },
        {
          title: 'Transaction 2',
          description: 'Transaction Description 2',
          amount: 200,
          type: TransactionEnum.EXPENSE,
          account_id: 'account-id',
          category_id: 'category-id',
          user_id: userId,
          date: new Date(),
          is_paid: true,
        },
      ],
    })

    expect(response.createdCount).toBe(2)

    const account = await accountRepository.findById('account-id')

    expect(account?.balance).toBe(-100)
    expect(account?.expense).toBe(200)
    expect(account?.income).toBe(100)
  })
})
