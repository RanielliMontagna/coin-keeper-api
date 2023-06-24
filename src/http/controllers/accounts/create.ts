import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateAccountUseCase } from '@/use-cases/factories/accounts/make-create-account-use-case'
import { returnData } from '@/utils/http/returnData'

export async function createAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAccountBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
  })

  const { name, balance } = createAccountBodySchema.parse(request.body)

  const createAccountUseCase = makeCreateAccountUseCase()

  const { account } = await createAccountUseCase.execute({
    name,
    balance,
    userId: request.user.sub,
  })

  return reply.status(201).send(returnData({ id: account.id }))
}
