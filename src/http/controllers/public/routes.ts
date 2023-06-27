import { FastifyInstance } from 'fastify'
import { check } from './check'

export async function publicRoutes(app: FastifyInstance) {
  app.get('/', check)
}
