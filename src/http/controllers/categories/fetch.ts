import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchCategoriesUseCase } from '@/use-cases/factories/categories/make-fetch-categories-use-case'
import { returnData } from '@/utils/http/returnData'

export async function fetchCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCategoriesUseCase = makeFetchCategoriesUseCase()

  const { categories } = await fetchCategoriesUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send(returnData({ categories }))
}
