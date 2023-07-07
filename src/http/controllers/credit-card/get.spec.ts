import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionTypeEnum } from '@/use-cases/accounts/create-account'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

describe('Get Credit Card (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a credit card', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionTypeEnum.NUBANK,
        balance: 1000,
      })

    const createCreditCardRespose = await request(app.server)
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
      .get(`/credit-cards/${createCreditCardRespose.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        creditCard: expect.objectContaining({
          id: expect.any(String),
          name: 'Credit Card Example',
          limit: 1000,
          flag: FlagEnum.VISA,
          closingDay: 28,
          dueDay: 10,
        }),
      },
    })
  })
})
