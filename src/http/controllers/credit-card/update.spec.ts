import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionTypeEnum } from '@/use-cases/accounts/create-account'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

describe('Update Credit Card (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update a credit card', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionTypeEnum.NUBANK,
        balance: 1000,
      })

    const createCreditCardResponse = await request(app.server)
      .post('/credit-cards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Credit Card Example',
        limit: 1000,
        flag: FlagEnum.VISA,
        closingDay: 28,
        dueDay: 10,
        accountId: createAccountResponse.body.data.id,
      })

    const response = await request(app.server)
      .put(`/credit-cards/${createCreditCardResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Credit Card Example Updated',
        limit: 2000,
        flag: FlagEnum.MASTERCARD,
        closingDay: 29,
        dueDay: 11,
        accountId: createAccountResponse.body.data.id,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: expect.objectContaining({
        id: expect.any(String),
        name: 'Credit Card Example Updated',
        limit: 2000,
        flag: FlagEnum.MASTERCARD,
        closingDay: 29,
        dueDay: 11,
        accountId: createAccountResponse.body.data.id,
      }),
    })
  })
})
