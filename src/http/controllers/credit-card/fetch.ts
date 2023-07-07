import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchCreditCardsUseCase } from '@/use-cases/factories/credit-cards/make-fetch-credit-cards-use-case'
import { returnData } from '@/utils/http/returnData'

export async function fetchCreditCards(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCreditCardsUseCase = makeFetchCreditCardsUseCase()

  const { creditCards } = await fetchCreditCardsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send(returnData({ creditCards }))
}
