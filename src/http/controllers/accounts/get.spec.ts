import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { Institution } from '@prisma/client'

describe('Get Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an account', async () => {
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
      .get(`/accounts/${createAccountResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        account: {
          id: createAccountResponse.body.data.id,
          institution: Institution.NUBANK,
          name: 'Account Example',
          balance: 1000,
        },
      },
    })
  })
})
