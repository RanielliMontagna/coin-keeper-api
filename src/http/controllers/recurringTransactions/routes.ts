import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createRecurringTransaction } from './create'

export async function recurringTransactionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/recurring-transactions', createRecurringTransaction)
}
