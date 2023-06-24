import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchAccounts } from './fetch'
import { getAccount } from './get'
import { createAccount } from './create'
import { updateAccount } from './update'
import { deleteAccount } from './delete'

export async function accountRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', fetchAccounts)
  app.get('/accounts/:id', getAccount)
  app.post('/accounts', createAccount)
  app.put('/accounts/:id', updateAccount)
  app.delete('/accounts/:id', deleteAccount)
}
