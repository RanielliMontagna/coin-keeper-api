import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'

describe('Delete Credit Card (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a credit card', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const accountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionEnum.NUBANK,
        balance: 1000,
      })

    const creditCardresponse = await request(app.server)
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

    const response = await request(app.server)
      .delete(`/credit-cards/${creditCardresponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(204)

    const getCreditCardResponse = await request(app.server)
      .get(`/credit-cards/${creditCardresponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getCreditCardResponse.status).toEqual(400)
  })
})
