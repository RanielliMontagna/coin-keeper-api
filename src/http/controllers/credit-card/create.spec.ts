import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'

describe('Create Credit Card (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a credit card', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const accountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionEnum.NUBANK,
        balance: 1000,
      })

    const response = await request(app.server)
      .post('/credit-cards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Credit Card Example',
        limit: 1000,
        flag: FlagEnum.VISA,
        closingDay: 28,
        dueDay: 10,
        accountId: accountResponse.body.data.id,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({ data: { id: expect.any(String) } })
  })
})
