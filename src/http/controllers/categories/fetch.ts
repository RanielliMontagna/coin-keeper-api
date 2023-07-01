import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchCategoriesUseCase } from '@/use-cases/factories/categories/make-fetch-categories-use-case'
import { returnData } from '@/utils/http/returnData'

export async function fetchCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCategoriesQuerySchema = z.object({
    search: z.string().optional(),
  })

  const { search } = fetchCategoriesQuerySchema.parse(request.query)

  const fetchCategoriesUseCase = makeFetchCategoriesUseCase()

  const { categories } = await fetchCategoriesUseCase.execute({
    userId: request.user.sub,
    options: { search },
  })

  return reply.status(200).send(returnData({ categories }))
}
