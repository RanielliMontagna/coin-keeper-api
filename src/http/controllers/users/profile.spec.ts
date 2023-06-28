import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Name Example',
      email: 'name@example.com',
      password: 'A1s2d3',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'name@example.com',
      password: 'A1s2d3',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'name@example.com',
        name: 'Name Example',
        organizationId: expect.any(String),
      }),
    )
  })
})
