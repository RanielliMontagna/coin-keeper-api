import { FastifyReply, FastifyRequest } from 'fastify'

import { returnData } from '@/utils/http/returnData'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetTransactionsBalanceUseCase } from '@/use-cases/factories/transactions/make-get-transaction-balance'

export async function getTransactionsBalance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeGetTransactionsBalanceUseCase()

    const { balance, expenses, incomes } =
      await fetchTransactionsUseCase.execute({
        userId: request.user.sub,
      })

    return reply.status(200).send(
      returnData({
        balance,
        expenses,
        incomes,
      }),
    )
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
