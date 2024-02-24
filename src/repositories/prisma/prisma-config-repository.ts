import { prisma } from '@/lib/prisma'
import {
  ConfigRepository,
  ConfigUpdateRequest,
  UpdateAllConfigsRequest,
} from '../config-repository'

export class PrismaConfigRepository implements ConfigRepository {
  async findConfigByKey(key: string, userId: string) {
    const config = await prisma.config.findFirst({
      where: { key, user_id: userId },
    })

    return config
  }

  async findConfigsByUserId(userId: string) {
    const configs = await prisma.config.findMany({
      where: { user_id: userId },
    })

    return configs?.map((c) => ({ id: c.id, key: c.key, value: c.value }))
  }

  async updateConfig({ userId, key, value }: ConfigUpdateRequest) {
    const updatedConfig = await prisma.config.update({
      where: { id: userId, key: key },
      data: { value },
    })

    return updatedConfig
  }

  async updateAllConfigs({ userId, configs }: UpdateAllConfigsRequest) {
    const updatedConfigs = await Promise.all(
      configs.map((config) =>
        prisma.config.update({
          data: { value: config.value },
          where: { id: config.id, key: config.key, user_id: userId },
        }),
      ),
    )

    return { updatedCount: updatedConfigs.length }
  }
}
