import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

describe('Fetch Credit Cards (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch credit cards', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionEnum.NUBANK,
        balance: 1000,
      })

    for (let i = 0; i < 5; i++) {
      await request(app.server)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Credit Card Example ${i}`,
          limit: 1000,
          flag: FlagEnum.VISA,
          closingDay: 28,
          dueDay: 10,
          accountId: createAccountResponse.body.data.id,
        })
    }

    const response = await request(app.server)
      .get('/credit-cards')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        creditCards: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: 'Credit Card Example 0',
            limit: 1000,
            flag: FlagEnum.VISA,
            closingDay: 28,
            dueDay: 10,
            account: {
              id: createAccountResponse.body.data.id,
              name: 'Account Example',
              institution: InstitutionEnum.NUBANK,
            },
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: 'Credit Card Example 4',
            limit: 1000,
            flag: FlagEnum.VISA,
            closingDay: 28,
            dueDay: 10,
            account: {
              id: createAccountResponse.body.data.id,
              name: 'Account Example',
              institution: InstitutionEnum.NUBANK,
            },
          }),
        ]),
      },
    })
  })
})
