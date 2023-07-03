import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeDeleteTransactionUseCase } from '@/use-cases/factories/transactions/make-delete-transaction-use-case'
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

export async function deleteTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteTransactionQuerySchema = z.object({ id: z.string() })

  const { id } = deleteTransactionQuerySchema.parse(request.params)

  try {
    const deleteTransactionUseCase = makeDeleteTransactionUseCase()

    await deleteTransactionUseCase.execute({ transactionId: id })
  } catch (err) {
    if (err instanceof TransactionNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }

  return reply.status(204).send()
}
