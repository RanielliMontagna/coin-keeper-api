import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateAccountUseCase } from '@/use-cases/factories/accounts/make-create-account-use-case'
import { returnData } from '@/utils/http/returnData'

export enum InstitutionTypeEnum {
  NUBANK = 'NUBANK',
  XP = 'XP',
  ITAU = 'ITAU',
  BRADESCO = 'BRADESCO',
  SANTANDER = 'SANTANDER',
  BANCO_DO_BRASIL = 'BANCO_DO_BRASIL',
  CAIXA = 'CAIXA',
  INTER = 'INTER',
  SICOOB = 'SICOOB',
  SICREDI = 'SICREDI',
  OTHER = 'OTHER',
}

export async function createAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAccountBodySchema = z.object({
    name: z.string(),
    institution: z.nativeEnum(InstitutionTypeEnum).optional(),
    balance: z.number(),
  })

  const { name, institution, balance } = createAccountBodySchema.parse(
    request.body,
  )

  const createAccountUseCase = makeCreateAccountUseCase()

  const { account } = await createAccountUseCase.execute({
    name,
    balance,
    institution: institution || InstitutionTypeEnum.OTHER,
    userId: request.user.sub,
  })

  return reply.status(201).send(returnData({ id: account.id }))
}
