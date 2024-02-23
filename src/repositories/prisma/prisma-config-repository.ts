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
    const updatedConfigs = await prisma.config.updateMany({
      where: { user_id: userId, key: { in: configs.map((c) => c.key) } },
      data: configs.map((c) => ({ key: c.key, value: c.value })),
    })

    return { updatedCount: updatedConfigs.count }
  }
}
