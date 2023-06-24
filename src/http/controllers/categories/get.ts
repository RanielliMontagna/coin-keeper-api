import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetCategoryUseCase } from '@/use-cases/factories/categories/make-get-category-use-case'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'
import { returnData } from '@/utils/http/returnData'

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCategoryQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = getCategoryQuerySchema.parse(request.params)

  const getCategoryUseCase = makeGetCategoryUseCase()

  try {
    const { category } = await getCategoryUseCase.execute({
      categoryId: id,
      userId: request.user.sub,
    })

    return reply.status(200).send(returnData({ category }))
  } catch (err) {
    if (err instanceof CategoryNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
