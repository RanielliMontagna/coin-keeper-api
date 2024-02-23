import { ConfigRepository } from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'
import { Config } from '@prisma/client'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { ConfigNotFoundError } from '../errors/config-not-found-error'

interface UpdateConfigUseCaseRequest {
  userId: string
  key: string
  value: string
}

interface UpdateConfigUseCaseResponse {
  updatedConfig: {
    id: Config['id']
    key: Config['key']
    value: Config['value']
  }
}

export class UpdateConfigUseCase {
  constructor(
    private configRepository: ConfigRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    key,
    value,
    userId,
  }: UpdateConfigUseCaseRequest): Promise<UpdateConfigUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const config = await this.configRepository.findConfigByKey(key, userId)

    if (!config) {
      throw new ConfigNotFoundError()
    }

    const updatedConfig = await this.configRepository.updateConfig({
      key,
      value,
      userId,
    })

    return {
      updatedConfig: {
        id: updatedConfig.id,
        key: updatedConfig.key,
        value: updatedConfig.value,
      },
    }
  }
}
