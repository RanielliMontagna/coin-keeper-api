import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { CreateAccountUseCase } from './create-account'
import { UserTypeEnum } from '../users/register-user'
import { Institution } from '@prisma/client'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let sut: CreateAccountUseCase

describe('Create Account Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateAccountUseCase(accountRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to create a new account', async () => {
    const response = await sut.execute({
      name: 'Account Name',
      institution: Institution.NUBANK,
      balance: 100,
      userId: userId,
    })

    expect(response.account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Account Name',
        balance: 100,
        user_id: userId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to create a new account with a non-existing user', async () => {
    await expect(
      sut.execute({
        name: 'Account Name',
        institution: Institution.NUBANK,
        balance: 100,
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
