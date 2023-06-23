import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAccountsUseCase } from '@/use-cases/factories/accounts/make-fetch-accounts-use-case'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchAccountsUseCase = makeFetchAccountsUseCase()

  const { accounts } = await fetchAccountsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ accounts })
}
