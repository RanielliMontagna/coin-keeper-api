import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchCreditCards } from './fetch'
import { getCreditCard } from './get'
import { createCreditCard } from './create'
import { updateCreditCard } from './update'
import { deleteCreditCard } from './delete'

export async function creditCardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/credit-cards', fetchCreditCards)
  app.get('/credit-cards/:id', getCreditCard)
  app.post('/credit-cards', createCreditCard)
  app.put('/credit-cards/:id', updateCreditCard)
  app.delete('/credit-cards/:id', deleteCreditCard)
}
