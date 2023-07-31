import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateAccountUseCase } from '@/use-cases/factories/accounts/make-create-account-use-case'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { returnData } from '@/utils/http/returnData'

export async function createAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAccountBodySchema = z.object({
    name: z.string(),
    institution: z.nativeEnum(InstitutionEnum).optional(),
    balance: z.number(),
  })

  const { name, institution, balance } = createAccountBodySchema.parse(
    request.body,
  )

  const createAccountUseCase = makeCreateAccountUseCase()

  const { account } = await createAccountUseCase.execute({
    name,
    balance,
    institution: institution || InstitutionEnum.OTHER,
    userId: request.user.sub,
  })

  return reply.status(201).send(returnData({ id: account.id }))
}
