import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchConfigs } from './fetch'
import { updateAllConfigs } from './update'

export async function configRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/configs', fetchConfigs)
  app.put('/configs', updateAllConfigs)
}
