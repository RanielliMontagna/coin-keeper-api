import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateCategoryUseCase } from '@/use-cases/factories/categories/make-update-category-use-case'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'
import { returnData } from '@/utils/http/returnData'

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCategoryQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = updateCategoryQuerySchema.parse(request.params)

  const updateCategoryBodySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.number().min(0).max(9),
  })

  const { name, description, color } = updateCategoryBodySchema.parse(
    request.body,
  )

  const updateCategoryUseCase = makeUpdateCategoryUseCase()

  try {
    const { category } = await updateCategoryUseCase.execute({
      name,
      description,
      color,
      categoryId: id,
      userId: request.user.sub,
    })

    return reply.status(200).send(
      returnData({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
      }),
    )
  } catch (err) {
    if (err instanceof CategoryNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }
}
