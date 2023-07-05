import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { Institution } from '@prisma/client'

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
        institution: Institution.NUBANK,
        balance: 1000,
      })

    const response = await request(app.server)
      .put(`/accounts/${createAccountResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example Updated',
        institution: Institution.INTER,
        balance: 2000,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        id: createAccountResponse.body.data.id,
        institution: Institution.INTER,
        name: 'Account Example Updated',
        balance: 2000,
      },
    })
  })
})
