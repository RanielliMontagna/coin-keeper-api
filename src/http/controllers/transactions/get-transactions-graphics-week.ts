import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetTransactionsGraphicsWeekUseCase } from '@/use-cases/factories/transactions/make-get-transactions-graphics-week-use-case'

export async function getTransactionsGraphicsWeek(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeGetTransactionsGraphicsWeekUseCase()

    const { week } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ week }))
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
