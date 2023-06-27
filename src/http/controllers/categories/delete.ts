import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeDeleteCategoryUseCase } from '@/use-cases/factories/categories/make-delete-category-use-case'
import { CategoryNotFoundError } from '@/use-cases/errors/category-not-found-error'

export async function deleteCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCategoryQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = deleteCategoryQuerySchema.parse(request.params)

  try {
    const deleteCategoryUseCase = makeDeleteCategoryUseCase()

    await deleteCategoryUseCase.execute({
      categoryId: id,
    })
  } catch (err) {
    if (err instanceof CategoryNotFoundError) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }

  return reply.status(204).send()
}
