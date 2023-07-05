import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetTransactionsGraphicsYearUseCase } from '@/use-cases/factories/transactions/make-get-transactions-graphics-year-use-case'

export async function getTransactionsGraphicsYear(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeGetTransactionsGraphicsYearUseCase()

    const { year } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ year }))
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
