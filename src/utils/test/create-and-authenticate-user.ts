import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UserTypeEnum } from '@/use-cases/users/register-user'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const { id } = await prisma.organization.create({
    data: {
      name: 'Organization Example',
    },
  })

  await prisma.user.create({
    data: {
      name: 'Name Example',
      email: 'name@example.com',
      password_hash: await hash('A1s2d3', 8),
      type: isAdmin ? UserTypeEnum.ADMIN : UserTypeEnum.GUEST,
      organization_id: id,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'name@example.com',
    password: 'A1s2d3',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
