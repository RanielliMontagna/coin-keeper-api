import { Config } from '@prisma/client'

export interface ConfigReturn {
  id: Config['id']
  key: Config['key']
  value: Config['value']
}

export interface ConfigRepository {
  findConfigurationsByUserId(userId: string): Promise<ConfigReturn[]>
}
