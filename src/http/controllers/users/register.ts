import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'

import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySquema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    photo: z.string().optional(),
    googleId: z.string(),
  })

  const { name, email, photo, googleId } = registerBodySquema.parse(
    request.body,
  )

  try {
    const registerUserUseCase = makeRegisterUserUseCase()

    await registerUserUseCase.execute({
      name,
      email,
      photo,
      googleId,
    })
  } catch (err) {
    if (
      err instanceof UserAlreadyExistsError ||
      err instanceof OrganizationNotFoundError
    ) {
      reply.status(400).send({ message: err.message })
      return
    }

    throw err
  }

  return reply.status(201).send()
}
