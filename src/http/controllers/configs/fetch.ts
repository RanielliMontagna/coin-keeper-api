import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { makeFetchConfigsUseCase } from '@/use-cases/factories/configs/make-fetch-configs-use-case'

export async function fetchConfigs(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchConfigsUseCase = makeFetchConfigsUseCase()

  const { configs } = await fetchConfigsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send(returnData({ configs }))
}
