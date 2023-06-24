import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchCategories } from './fetch'
import { getCategory } from './get'
import { createCategory } from './create'
import { updateCategory } from './update'
import { deleteCategory } from './delete'

export async function categoryRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/categories', fetchCategories)
  app.get('/categories/:id', getCategory)
  app.post('/categories', createCategory)
  app.put('/categories/:id', updateCategory)
  app.delete('/categories/:id', deleteCategory)
}
