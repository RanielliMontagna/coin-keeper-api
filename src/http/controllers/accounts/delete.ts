import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeDeleteAccountUseCase } from '@/use-cases/factories/accounts/make-delete-account-use-case'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteAccountQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = deleteAccountQuerySchema.parse(request.params)

  try {
    const deleteAccountUseCase = makeDeleteAccountUseCase()

    await deleteAccountUseCase.execute({
      accountId: id,
    })
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }

  return reply.status(204).send()
}
