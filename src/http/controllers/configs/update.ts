import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

import { returnData } from '@/utils/http/returnData'
import { makeUpdateAllConfigsUseCase } from '@/use-cases/factories/configs/make-update-all-configs-use-case'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { ConfigNotFoundError } from '@/use-cases/errors/config-not-found-error'

export async function updateAllConfigs(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateAllConfigsBodySchema = z.object({
    configs: z.array(
      z.object({ id: z.string(), key: z.string(), value: z.string() }),
    ),
  })

  const { configs } = updateAllConfigsBodySchema.parse(request.body)

  const updateAllConfigsUseCase = makeUpdateAllConfigsUseCase()

  try {
    const { updatedCount } = await updateAllConfigsUseCase.execute({
      configs,
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ updatedCount }))
  } catch (err) {
    if (
      err instanceof UserNotFoundError ||
      err instanceof ConfigNotFoundError
    ) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
