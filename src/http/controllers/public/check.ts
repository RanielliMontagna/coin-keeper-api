import { FastifyReply, FastifyRequest } from 'fastify'

export function check(_: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ status: 'ok' })
}
