import { ConfigRepository } from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'

import { InMemoryConfigRepository } from '@/repositories/in-memory/in-memory-config-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { FetchConfigsUseCase } from './fetch-configs'
import { UserTypeEnum } from '../users/register-user'

let configRepository: ConfigRepository
let userRepository: UserRepository
let sut: FetchConfigsUseCase

describe('Fetch Configs Use Case', () => {
  const userId = 'example-user-id'

  beforeEach(async () => {
    configRepository = new InMemoryConfigRepository()
    userRepository = new InMemoryUserRepository()
    sut = new FetchConfigsUseCase(configRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to fetch configs', async () => {
    const response = await sut.execute({ userId })

    console.log('response:', response)

    expect(response.configs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          key: 'example',
          value: 'example-value',
        }),
      ]),
    )
  })

  it('should not be able to fetch configs with an invalid user', async () => {
    await expect(
      sut.execute({ userId: 'invalid-user-id' }),
    ).rejects.toThrowError(UserNotFoundError)
  })
})
