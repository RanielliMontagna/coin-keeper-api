import { Config } from '@prisma/client'

import { ConfigRepository } from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchConfigsUseCaseRequest {
  userId: string
}

interface FetchConfigsUseCaseResponse {
  configs: {
    id: Config['id']
    key: Config['key']
    value: Config['value']
  }[]
}

export class FetchConfigsUseCase {
  constructor(
    private configRepository: ConfigRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchConfigsUseCaseRequest): Promise<FetchConfigsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const configs = await this.configRepository.findConfigurationsByUserId(
      userId,
    )

    return {
      configs: configs.map((config) => ({
        id: config.id,
        key: config.key,
        value: config.value,
      })),
    }
  }
}
