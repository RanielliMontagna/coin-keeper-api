import { Config } from '@prisma/client'

import type {
  ConfigRepository,
  ConfigReturn,
  ConfigUpdateRequest,
  UpdateAllConfigsRequest,
} from '../config-repository'

export class InMemoryConfigRepository implements ConfigRepository {
  private configs: Config[] = [
    {
      id: 'example-id',
      key: 'example',
      value: 'example-value',
      user_id: 'example-user-id',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  async findConfigByKey(key: string, userId: string): Promise<Config | null> {
    return (
      this.configs.find(
        (config) => config.key === key && config.user_id === userId,
      ) || null
    )
  }

  async findConfigsByUserId(userId: string): Promise<ConfigReturn[]> {
    return this.configs
      .filter((config) => config.user_id === userId)
      .map((c) => ({ id: c.id, key: c.key, value: c.value }))
  }

  async updateConfig({ userId, key, value }: ConfigUpdateRequest) {
    const config = this.configs.find(
      (c) => c.key === key && c.user_id === userId,
    )

    config!.value = value

    return config as Config
  }

  async updateAllConfigs({ userId, configs }: UpdateAllConfigsRequest) {
    const updatedConfigs = configs.map((c) => {
      const config = this.configs.find(
        (config) => config.key === c.key && config.user_id === userId,
      )

      config!.value = c.value

      return config as Config
    })

    return { updatedCount: updatedConfigs.length }
  }
}
