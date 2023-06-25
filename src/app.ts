import fastify from 'fastify'
import { fastifyJwt } from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { ZodError } from 'zod'

import { env } from '@/env'

import { publicRoutes } from '@/http/controllers/public/routes'
import { userRoutes } from '@/http/controllers/users/routes'
import { accountRoutes } from './http/controllers/accounts/routes'
import { categoryRoutes } from './http/controllers/categories/routes'
import { transactionRoutes } from './http/controllers/transactions/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(publicRoutes)
app.register(userRoutes)
app.register(accountRoutes)
app.register(categoryRoutes)
app.register(transactionRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
