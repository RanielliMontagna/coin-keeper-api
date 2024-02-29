import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { fetchByAccountsTransactions } from './fetch-by-accounts'
import { fetchByUserTransactions } from './fetch-by-user'
import { createTransaction } from './create'
import { deleteTransaction } from './delete'
import { getLatestTransactions } from './get-latest-transactions'
import { getTransactionsBalance } from './get-transactions-balance'
import { getTransactionsGraphicsWeek } from './get-transactions-graphics-week'
import { getTransactionsGraphicsMonth } from './get-transactions-graphics-month'
import { getTransactionsGraphicsYear } from './get-transactions-graphics-year'
import { markTransactionAsPaid } from './mark-transaction-as-paid'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts/:accountId/transactions', fetchByAccountsTransactions)
  app.get('/transactions', fetchByUserTransactions)
  app.get('/transactions/latest', getLatestTransactions)
  app.get('/transactions/balance', getTransactionsBalance)

  app.patch('/transactions/:transactionId/paid', markTransactionAsPaid)

  app.get('/transactions/graphics/week', getTransactionsGraphicsWeek)
  app.get('/transactions/graphics/month', getTransactionsGraphicsMonth)
  app.get('/transactions/graphics/year', getTransactionsGraphicsYear)

  app.post('/transactions', createTransaction)
  app.delete('/transactions/:id', deleteTransaction)
}
