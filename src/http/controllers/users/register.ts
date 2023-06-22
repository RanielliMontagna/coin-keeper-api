import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'

import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySquema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message:
          'Password must have at least 1 uppercase, 1 lowercase and 1 number',
      }),
  })

  const { name, email, password } = registerBodySquema.parse(request.body)

  try {
    const registerUserUseCase = makeRegisterUserUseCase()

    await registerUserUseCase.execute({
      name,
      email,
      password,
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
