import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetch } from './fetch'
import { get } from './get'
import { createAccount } from './create'
import { updateAccount } from './update'
import { deleteAccount } from './delete'

export async function accountRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', fetch)
  app.get('/accounts/:id', get)
  app.post('/accounts', createAccount)
  app.put('/accounts/:id', updateAccount)
  app.delete('/accounts/:id', deleteAccount)
}
