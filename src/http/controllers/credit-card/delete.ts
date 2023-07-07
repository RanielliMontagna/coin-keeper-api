import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-delete-credit-card-use-case'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'

export async function deleteCreditCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCreditCardQuerySchema = z.object({ id: z.string() })

  const { id } = deleteCreditCardQuerySchema.parse(request.params)

  try {
    const deleteCreditCardUseCase = makeDeleteCreditCardUseCase()

    await deleteCreditCardUseCase.execute({ creditCardId: id })
  } catch (err) {
    if (err instanceof CreditCardNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }

  return reply.status(204).send()
}
