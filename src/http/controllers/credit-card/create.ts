import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-create-credit-card-use-case'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'
import { returnData } from '@/utils/http/returnData'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

export async function createCreditCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCreditCardBodySchema = z.object({
    name: z.string(),
    limit: z.number(),
    flag: z.nativeEnum(FlagEnum),
    closingDay: z.number(),
    dueDay: z.number(),
    accountId: z.string().uuid(),
  })

  const body = createCreditCardBodySchema.parse(request.body)

  const createCreditCardUseCase = makeCreateCreditCardUseCase()

  try {
    const { creditCard } = await createCreditCardUseCase.execute({
      name: body.name,
      limit: body.limit,
      flag: body.flag,
      closingDay: body.closingDay,
      dueDay: body.dueDay,
      accountId: body.accountId,
      userId: request.user.sub,
    })

    return reply.status(201).send(returnData({ id: creditCard.id }))
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
