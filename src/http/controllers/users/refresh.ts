import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { type, email, name } = request.user

  const token = await reply.jwtSign(
    { type, email, name },
    { sign: { sub: request.user.sub } },
  )

  const refreshToken = await reply.jwtSign(
    { type, email, name },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
