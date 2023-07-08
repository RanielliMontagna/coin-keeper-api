import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { FetchAccountsUseCase } from './fetch-accounts'
import { InstitutionEnum } from './create-account'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let sut: FetchAccountsUseCase

describe('Fetch Accounts Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchAccountsUseCase(accountRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to fetch accounts', async () => {
    await accountRepository.create({
      name: 'Account Name',
      balance: 0,
      user_id: userId,
    })

    const response = await sut.execute({
      userId,
    })

    expect(response.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Account Name',
          balance: 0,
        }),
      ]),
    )
  })

  it('should not be able to fetch accounts with an inexistent user', async () => {
    await expect(
      sut.execute({
        userId: 'inexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should be able to fetch accounts with search option', async () => {
    await accountRepository.create({
      name: 'Account Name',
      institution: InstitutionEnum.NUBANK,
      balance: 0,
      user_id: userId,
    })

    await accountRepository.create({
      name: 'Another Account Name',
      institution: InstitutionEnum.NUBANK,
      balance: 0,
      user_id: userId,
    })

    const response = await sut.execute({
      userId,
      options: {
        search: 'anoth',
      },
    })

    expect(response.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          institution: InstitutionEnum.NUBANK,
          name: 'Another Account Name',
          balance: 0,
        }),
      ]),
    )
  })
})
