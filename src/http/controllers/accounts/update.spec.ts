import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'

describe('Update Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update an account', async () => {
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
      .put(`/accounts/${createAccountResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example Updated',
        institution: InstitutionEnum.INTER,
        balance: 2000,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        id: createAccountResponse.body.data.id,
        institution: InstitutionEnum.INTER,
        name: 'Account Example Updated',
        balance: 2000,
      },
    })
  })
})
