import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAccountsUseCase } from '@/use-cases/factories/accounts/make-fetch-accounts-use-case'
import { returnData } from '@/utils/http/returnData'
import { z } from 'zod'

export async function fetchAccounts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAccountsQuerySchema = z.object({
    search: z.string().optional(),
  })

  const { search } = fetchAccountsQuerySchema.parse(request.query)

  const fetchAccountsUseCase = makeFetchAccountsUseCase()

  const { accounts } = await fetchAccountsUseCase.execute({
    userId: request.user.sub,
    options: { search },
  })

  return reply.status(200).send(returnData({ accounts }))
}
