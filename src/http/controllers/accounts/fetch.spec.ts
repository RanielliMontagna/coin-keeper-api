import request from 'supertest'
import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'

describe('Fetch Accounts (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch accounts', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionEnum.NUBANK,
        balance: 1000,
      })

    const response = await request(app.server)
      .get('/accounts')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        accounts: expect.arrayContaining([
          expect.objectContaining({
            id: createAccountResponse.body.data.id,
            institution: InstitutionEnum.NUBANK,
            name: 'Account Example',
            balance: 1000,
          }),
        ]),
      },
    })
  })
})
