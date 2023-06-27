import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      type: 'ADMIN' | 'GUEST'
      sub: string
    }
  }
}
