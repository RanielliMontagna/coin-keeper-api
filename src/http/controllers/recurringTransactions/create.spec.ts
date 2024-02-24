import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { ColorEnum } from '@/use-cases/categories/create-category'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'
import { FrequencyEnum } from '@/use-cases/recurring-transactions/create-recurring-transaction'

describe('Create Recurring Transaction (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a recurring transaction', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseAccount = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        institution: InstitutionEnum.NUBANK,
        balance: 1000,
      })

    const responseCategory = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: ColorEnum.BLUE,
      })

    const response = await request(app.server)
      .post('/recurring-transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Transaction Example',
        description: 'Transaction Example Description',
        amount: 1000,
        type: TransactionEnum.INCOME,
        frequency: FrequencyEnum.MONTHLY,
        startDate: new Date(),
        repeatAmount: 12,
        accountId: responseAccount.body.data.id,
        categoryId: responseCategory.body.data.id,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      data: {
        id: expect.any(String),
      },
    })
  })
})
