import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      email: string
      name: string
      type: 'ADMIN' | 'GUEST'
      sub: string
    }
  }
}
