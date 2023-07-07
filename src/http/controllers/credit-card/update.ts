import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'
import { makeUpdateCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-update-category-use-case'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

import { returnData } from '@/utils/http/returnData'

export async function updateCreditCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCreditCardQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = updateCreditCardQuerySchema.parse(request.params)

  const updateCreditCardBodySchema = z.object({
    name: z.string(),
    limit: z.number(),
    flag: z.nativeEnum(FlagEnum),
    closingDay: z.number(),
    dueDay: z.number(),
    accountId: z.string().uuid(),
  })

  const { name, limit, flag, dueDay, closingDay, accountId } =
    updateCreditCardBodySchema.parse(request.body)

  const updateCreditCardUseCase = makeUpdateCreditCardUseCase()

  try {
    const { creditCard } = await updateCreditCardUseCase.execute({
      id,
      name,
      limit,
      flag,
      accountId,
      closingDay,
      dueDay,
      userId: request.user.sub,
    })

    return reply.status(200).send(
      returnData({
        id: creditCard.id,
        name: creditCard.name,
        limit: creditCard.limit,
        flag: creditCard.flag,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
        account: {
          id: creditCard.account.id,
          name: creditCard.account.name,
          institution: creditCard.account.institution,
        },
      }),
    )
  } catch (err) {
    if (err instanceof CreditCardNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
