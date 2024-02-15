import z from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeFetchTransactionsByUserUseCase } from '@/use-cases/factories/transactions/make-fetch-transactions-use-by-user-case'

export async function fetchByUserTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsByUserQuerySchema = z.object({
      page: z.coerce.number().optional(),
      date: z.coerce.string().optional(),
    })

    const { page, date } = fetchTransactionsByUserQuerySchema.parse(
      request.query,
    )

    const fetchTransactionsUseCase = makeFetchTransactionsByUserUseCase()

    const { transactions } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
      options: { page: page || 1, date },
    })

    return reply.status(200).send({
      ...returnData({ transactions }),
      meta: { page: page || 1, date },
    })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
