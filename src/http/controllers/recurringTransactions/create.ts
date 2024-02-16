import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateRecurringTransactionUseCase } from '@/use-cases/factories/recurring-transactions/make-create-recurring-transaction-use-case'
import { FrequencyEnum } from '@/use-cases/recurring-transactions/create-recurring-transaction'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'

import { returnData } from '@/utils/http/returnData'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

export async function createRecurringTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createRecurringTransactionBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number(),
    type: z.nativeEnum(TransactionEnum),
    frequency: z.nativeEnum(FrequencyEnum),
    startDate: z.string(),
    endDate: z.string().optional(),
    accountId: z.string(),
    categoryId: z.string(),
  })

  const {
    title,
    description,
    amount,
    type,
    frequency,
    startDate,
    endDate,
    accountId,
    categoryId,
  } = createRecurringTransactionBodySchema.parse(request.body)

  try {
    const createRecurringTransactionUseCase =
      makeCreateRecurringTransactionUseCase()

    const { recurringTransaction } =
      await createRecurringTransactionUseCase.execute({
        title,
        description,
        amount,
        type,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        accountId,
        categoryId,
        userId: request.user.sub,
      })

    return reply.status(201).send(returnData({ id: recurringTransaction.id }))
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
