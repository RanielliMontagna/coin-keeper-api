import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeMarkTransactionAsPaidUseCase } from '@/use-cases/factories/transactions/make-mark-transaction-as-paid-use-case'
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

export async function markTransactionAsPaid(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const markTransactionAsPaidRequestSchema = z.object({
      transactionId: z.string(),
    })

    const { transactionId } = markTransactionAsPaidRequestSchema.parse(
      request.params,
    )

    const markTransactionAsPaidUseCase = makeMarkTransactionAsPaidUseCase()

    const response = await markTransactionAsPaidUseCase.execute({
      transactionId,
      userId: request.user.sub,
    })

    return reply.status(200).send(response)
  } catch (err) {
    if (err instanceof TransactionNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
