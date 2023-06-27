import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetAccountUseCase } from '@/use-cases/factories/accounts/make-get-account-use-case'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'
import { returnData } from '@/utils/http/returnData'

export async function getAccount(request: FastifyRequest, reply: FastifyReply) {
  const getAccountQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = getAccountQuerySchema.parse(request.params)

  const getAccountUseCase = makeGetAccountUseCase()

  try {
    const { account } = await getAccountUseCase.execute({
      accountId: id,
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ account }))
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
