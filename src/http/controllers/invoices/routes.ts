import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createInvoiceExpense } from './create-invoice-expense'
import { fetchInvoices } from './fetch-invoices'

export async function invoicesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/credit-cards/:creditCardId/invoice/expense', createInvoiceExpense)
  app.get('/invoices', fetchInvoices)
}
