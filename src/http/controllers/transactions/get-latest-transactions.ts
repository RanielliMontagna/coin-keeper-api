import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetLatestTransactionsUseCase } from '@/use-cases/factories/transactions/make-get-latest-transactions'

export async function getLatestTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeGetLatestTransactionsUseCase()

    const { transactions } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ transactions }))
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
