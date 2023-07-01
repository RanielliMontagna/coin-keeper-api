import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateTransactionUseCase } from '@/use-cases/factories/transactions/make-create-transaction-use-case'
import { TransactionType } from '@/use-cases/transactions/create-transaction'

import { returnData } from '@/utils/http/returnData'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

export async function createTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTransactionBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number(),
    type: z.nativeEnum(TransactionType),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string(),
  })

  const { title, description, amount, type, date, accountId, categoryId } =
    createTransactionBodySchema.parse(request.body)

  try {
    const createTransactionUseCase = makeCreateTransactionUseCase()

    const { transaction } = await createTransactionUseCase.execute({
      title,
      description,
      amount,
      type,
      date: new Date(date),
      accountId,
      categoryId,
      userId: request.user.sub,
    })

    return reply.status(201).send(returnData({ id: transaction.id }))
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
