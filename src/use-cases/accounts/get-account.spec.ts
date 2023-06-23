import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

import { GetAccountUseCase } from './get-account'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let sut: GetAccountUseCase

describe('Get Account Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetAccountUseCase(accountRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to get a account', async () => {
    const account = await accountRepository.create({
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })

    const response = await sut.execute({
      accountId: account.id,
      userId,
    })

    expect(response.account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Account Name',
        balance: 0,
        user_id: userId,
      }),
    )
  })

  it('should not be able to get a account with an inexistent user', async () => {
    await expect(
      sut.execute({
        accountId: 'account-id',
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to get a non-existing account', async () => {
    await expect(
      sut.execute({
        accountId: 'non-existing-account-id',
        userId,
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })
})
