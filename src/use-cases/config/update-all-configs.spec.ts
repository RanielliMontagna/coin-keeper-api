import { InMemoryConfigRepository } from '@/repositories/in-memory/in-memory-config-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { ConfigRepository } from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UpdateAllConfigsUseCase } from './update-all-configs'
import { UserTypeEnum } from '../users/register-user'
import { UserNotFoundError } from '../errors/user-not-found-error'

let configRepository: ConfigRepository
let userRepository: UserRepository
let sut: UpdateAllConfigsUseCase

describe('Update All Configs Use Case', () => {
  const userId = 'example-user-id'

  beforeEach(async () => {
    configRepository = new InMemoryConfigRepository()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateAllConfigsUseCase(configRepository, userRepository)

    await userRepository.create({
      id: userId,
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organization_id: 'organization-id',
      password_hash: 'password-hash',
    })
  })

  it('should be able to update all configs', async () => {
    const configs = [{ key: 'example', value: 'new-example-value' }]

    const response = await sut.execute({ userId, configs })

    expect(response.updatedCount).toBe(1)

    const updatedConfig = await configRepository.findConfigByKey(
      'example',
      userId,
    )

    expect(updatedConfig?.value).toBe('new-example-value')
  })

  it('should not be able to update all configs if user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'invalid-user-id', configs: [] }),
    ).rejects.toThrow(UserNotFoundError)
  })
})
