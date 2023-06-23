import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an account', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        balance: 1000,
      })

    expect(response.status).toEqual(201)
  })
})
