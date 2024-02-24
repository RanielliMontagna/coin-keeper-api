import { InMemoryConfigRepository } from '@/repositories/in-memory/in-memory-config-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { ConfigRepository } from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UpdateConfigUseCase } from './update-config'
import { UserTypeEnum } from '../users/register-user'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { ConfigNotFoundError } from '../errors/config-not-found-error'

let configRepository: ConfigRepository
let userRepository: UserRepository
let sut: UpdateConfigUseCase

describe('Update Config Use Case', () => {
  const userId = 'example-user-id'

  beforeEach(async () => {
    configRepository = new InMemoryConfigRepository()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateConfigUseCase(configRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to update a config', async () => {
    const key = 'example'
    const value = 'new-example-value'

    const response = await sut.execute({ key, value, userId })

    expect(response.updatedConfig).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        key,
        value,
      }),
    )
  })

  it('should not be able to update a config with an invalid user', async () => {
    await expect(
      sut.execute({
        key: 'example',
        value: 'example-value',
        userId: 'invalid-user-id',
      }),
    ).rejects.toThrowError(UserNotFoundError)
  })

  it('should not be able to update a config that does not exist', async () => {
    await expect(
      sut.execute({
        key: 'invalid-key',
        value: 'example-value',
        userId,
      }),
    ).rejects.toThrowError(ConfigNotFoundError)
  })
})
