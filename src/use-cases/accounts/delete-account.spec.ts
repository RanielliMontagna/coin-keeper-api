import { InMemoryAccountRepository } from '@/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { UserTypeEnum } from '@/use-cases/users/register-user'

import { DeleteAccountUseCase } from './delete-account'
import { AccountNotFoundError } from '../errors/account-not-found-error'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let sut: DeleteAccountUseCase

describe('Update Account Use Case', () => {
  const userId = 'user-id'

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteAccountUseCase(accountRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to delete an account', async () => {
    const account = await accountRepository.create({
      name: 'Account Name',
      balance: 100,
      user_id: userId,
    })

    await sut.execute({ accountId: account.id })
    await expect(sut.execute({ accountId: account.id })).rejects.toBeInstanceOf(
      AccountNotFoundError,
    )
  })

  it('should not be able to delete a non-existing account', async () => {
    await expect(
      sut.execute({
        accountId: 'non-existing-account-id',
      }),
    ).rejects.toBeInstanceOf(AccountNotFoundError)
  })
})
