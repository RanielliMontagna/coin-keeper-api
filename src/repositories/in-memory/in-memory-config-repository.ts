import { Config } from '@prisma/client'

import type { ConfigRepository, ConfigReturn } from '../config-repository'
import { configs } from '@/constants/seeds'

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

  async findConfigurationsByUserId(userId: string): Promise<ConfigReturn[]> {
    return this.configs
      .filter((config) => config.user_id === userId)
      .map((c) => ({ id: c.id, key: c.key, value: c.value }))
  }

  async updateConfigurationsByUserId(
    userId: string,
    configs: ConfigReturn[],
  ): Promise<ConfigReturn[]> {
    const updatedConfigs: ConfigReturn[] = []

    for (const c of configs) {
      const configIndex = this.configs.findIndex(
        (config) => config.id === c.id && config.user_id === userId,
      )

      if (configIndex === -1) {
        continue
      }

      this.configs[configIndex] = {
        ...this.configs[configIndex],
        value: c.value,
      }

      updatedConfigs.push(this.configs[configIndex])
    }

    return updatedConfigs
  }
}
