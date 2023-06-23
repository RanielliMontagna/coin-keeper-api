import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Delete Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an account', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        balance: 1000,
      })

    const response = await request(app.server)
      .delete(`/accounts/${createAccountResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(204)

    const getAccountResponse = await request(app.server)
      .get(`/accounts/${createAccountResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getAccountResponse.status).toEqual(400)
  })
})
