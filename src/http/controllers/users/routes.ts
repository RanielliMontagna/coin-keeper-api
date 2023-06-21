import { FastifyInstance } from 'fastify'

import { register } from './register'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
