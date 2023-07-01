import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchByAccountsTransactions } from './fetch-by-accounts'
import { fetchByUserTransactions } from './fetch-by-user'
import { createTransaction } from './create'
import { deleteTransaction } from './delete'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts/:accountId/transactions', fetchByAccountsTransactions)
  app.get('/transactions', fetchByUserTransactions)
  app.post('/transactions', createTransaction)
  app.delete('/transactions/:id', deleteTransaction)
}
