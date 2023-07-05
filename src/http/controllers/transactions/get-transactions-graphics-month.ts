import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetTransactionsGraphicsMonthUseCase } from '@/use-cases/factories/transactions/make-get-transactions-graphics-month-use-case'

export async function getTransactionsGraphicsMonth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeGetTransactionsGraphicsMonthUseCase()

    const { month } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ month }))
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
