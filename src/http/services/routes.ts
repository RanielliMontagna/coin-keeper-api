import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { getQuotes } from './quotes/quotes'

export async function servicesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/services/quotes', getQuotes)
}
