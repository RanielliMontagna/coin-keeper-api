import { FastifyInstance } from 'fastify'
import { createAccount } from './create-account'

export async function accountRoutes(app: FastifyInstance) {
  app.post('/accounts', createAccount)
}
