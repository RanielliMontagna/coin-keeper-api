import { Config } from '@prisma/client'

export interface ConfigUpdateRequest {
  userId: string
  key: string
  value: string
}

export interface ConfigsUpdate extends Omit<ConfigUpdateRequest, 'userId'> {}

export interface UpdateAllConfigsRequest {
  userId: string
  configs: ConfigsUpdate[]
}

export interface ConfigReturn {
  id: Config['id']
  key: Config['key']
  value: Config['value']
}

export interface ConfigRepository {
  findConfigByKey(key: string, userId: string): Promise<Config | null>
  findConfigsByUserId(userId: string): Promise<ConfigReturn[]>
  updateConfig(config: ConfigUpdateRequest): Promise<Config>
  updateAllConfigs(
    payload: UpdateAllConfigsRequest,
  ): Promise<{ updatedCount: number }>
}
