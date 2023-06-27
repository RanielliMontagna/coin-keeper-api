import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchTransactions } from './fetch'
import { createTransaction } from './create'
import { deleteTransaction } from './delete'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts/:accountId/transactions', fetchTransactions)
  app.post('/transactions', createTransaction)
  app.delete('/transactions/:id', deleteTransaction)
}
