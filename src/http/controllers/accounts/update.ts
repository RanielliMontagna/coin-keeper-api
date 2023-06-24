import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateAccountUseCase } from '@/use-cases/factories/accounts/make-update-account-use-case'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'
import { returnData } from '@/utils/http/returnData'

export async function updateAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateAccountQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = updateAccountQuerySchema.parse(request.params)

  const updateAccountBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
  })

  const { name, balance } = updateAccountBodySchema.parse(request.body)

  const updateAccountUseCase = makeUpdateAccountUseCase()

  try {
    const { account } = await updateAccountUseCase.execute({
      name,
      balance,
      accountId: id,
      userId: request.user.sub,
    })

    return reply.status(200).send(
      returnData({
        id: account.id,
        name: account.name,
        balance: account.balance,
      }),
    )
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
