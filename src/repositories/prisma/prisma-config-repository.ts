import { prisma } from '@/lib/prisma'
import { ConfigRepository } from '../config-repository'

export class PrismaConfigRepository implements ConfigRepository {
  async findConfigurationsByUserId(userId: string) {
    const configs = await prisma.config.findMany({
      where: { user_id: userId },
    })

    return configs?.map((c) => ({ id: c.id, key: c.key, value: c.value }))
  }

  async updateConfigurationsByUserId(userId: string, configs: any[]) {
    const updatedConfigs = await Promise.all(
      configs.map(async (c) => {
        const config = await prisma.config.update({
          where: { id: c.id, user_id: userId },
          data: { value: c.value },
        })

        return config
      }),
    )

    return updatedConfigs
  }
}
