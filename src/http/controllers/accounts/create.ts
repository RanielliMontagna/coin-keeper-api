import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateAccountUseCase } from '@/use-cases/factories/accounts/make-create-account-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createAccountBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
  })

  console.log(request)

  const { name, balance } = createAccountBodySchema.parse(request.body)

  const createAccountUseCase = makeCreateAccountUseCase()

  await createAccountUseCase.execute({
    name,
    balance,
    userId: request.user.sub,
  })

  return reply.status(201).send()
}
