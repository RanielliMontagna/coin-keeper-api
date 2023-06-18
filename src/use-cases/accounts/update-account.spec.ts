import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { UpdateAccountUseCase } from './update-account'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { AccountNotFoundError } from '../errors/account-not-found-error'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let sut: UpdateAccountUseCase

describe('Update Account Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateAccountUseCase(accountRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
    })
  })

  it('should be able to update an account', async () => {
    const account = await accountRepository.create({
      name: 'Account Name',
      balance: 100,
      user_id: userId,
    })

    const response = await sut.execute({
      accountId: account.id,
      name: 'Updated Account Name',
      balance: 200,
      userId: userId,
    })

    expect(response.account).toEqual(
      expect.objectContaining({
        id: account.id,
        name: 'Updated Account Name',
        balance: 200,
        user_id: userId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to update a non-existing account', async () => {
    await expect(
      sut.execute({
        accountId: 'non-existing-account-id',
        name: 'Updated Account Name',
        balance: 200,
        userId: userId,
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })

  it("shout be able to update only the account's name", async () => {
    const account = await accountRepository.create({
      name: 'Account Name',
      balance: 100,
      user_id: userId,
    })

    const response = await sut.execute({
      accountId: account.id,
      name: 'Updated Account Name',
      userId: userId,
    })

    expect(response.account).toEqual(
      expect.objectContaining({
        id: account.id,
        name: 'Updated Account Name',
        balance: 100,
        user_id: userId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it("shout be able to update only the account's balance", async () => {
    const account = await accountRepository.create({
      name: 'Account Name',
      balance: 100,
      user_id: userId,
    })

    const response = await sut.execute({
      accountId: account.id,
      balance: 200,
      userId: userId,
    })

    expect(response.account).toEqual(
      expect.objectContaining({
        id: account.id,
        name: 'Account Name',
        balance: 200,
        user_id: userId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })
})
