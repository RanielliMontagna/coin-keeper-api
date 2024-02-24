import {
  ConfigRepository,
  ConfigsUpdate,
} from '@/repositories/config-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '../errors/user-not-found-error'

interface UpdateAllConfigsRequest {
  userId: string
  configs: ConfigsUpdate[]
}

interface UpdateAllConfigsResponse {
  updatedCount: number
}

export class UpdateAllConfigsUseCase {
  constructor(
    private configRepository: ConfigRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    configs,
  }: UpdateAllConfigsRequest): Promise<UpdateAllConfigsResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const updatedConfigs = await this.configRepository.updateAllConfigs({
      userId,
      configs,
    })

    return { updatedCount: updatedConfigs.updatedCount }
  }
}
