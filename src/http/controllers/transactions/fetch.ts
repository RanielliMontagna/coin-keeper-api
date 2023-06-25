import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchTransactionsUseCase } from '@/use-cases/factories/transactions/make-fetch-transactions-use-case'
import { returnData } from '@/utils/http/returnData'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

export async function fetchTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchTransactionsParamsSchema = z.object({
    accountId: z.string(),
  })
  const { accountId } = fetchTransactionsParamsSchema.parse(request.params)

  try {
    const fetchTransactionsUseCase = makeFetchTransactionsUseCase()

    const { transactions } = await fetchTransactionsUseCase.execute({
      accountId,
    })

    return reply.status(200).send(returnData({ transactions }))
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
