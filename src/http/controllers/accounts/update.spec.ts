import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an account', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        balance: 1000,
      })

    const response = await request(app.server)
      .put(`/accounts/${createAccountResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example Updated',
        balance: 2000,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      id: createAccountResponse.body.id,
      name: 'Account Example Updated',
      balance: 2000,
    })
  })
})
