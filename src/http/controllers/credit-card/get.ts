import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'
import { makeGetCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-get-credit-card-use-case'

import { returnData } from '@/utils/http/returnData'

export async function getCreditCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCreditCardQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = getCreditCardQuerySchema.parse(request.params)

  const getCreditCardUseCase = makeGetCreditCardUseCase()

  try {
    const { creditCard } = await getCreditCardUseCase.execute({
      creditCardId: id,
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ creditCard }))
  } catch (err) {
    if (err instanceof CreditCardNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
