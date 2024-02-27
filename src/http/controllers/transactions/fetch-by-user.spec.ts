import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { ColorEnum } from '@/use-cases/categories/create-category'

describe('Fetch Transactions By User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch transactions', async () => {
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

    await request(app.server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Transaction Example',
        description: 'Transaction Example Description',
        amount: 1000,
        type: TransactionEnum.INCOME,
        date: new Date(),
        accountId: responseAccount.body.data.id,
        categoryId: responseCategory.body.data.id,
      })

    const response = await request(app.server)
      .get(`/transactions`)
      .query({ date: new Date().toISOString() })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.meta).toEqual(
      expect.objectContaining({
        balance: 1000,
        incomes: 1000,
        expenses: 0,
        date: expect.any(String),
      }),
    )
    expect(response.body.data.transactions[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction Example',
        description: 'Transaction Example Description',
        amount: 1000,
        type: TransactionEnum.INCOME,
        date: expect.any(String),
        account: expect.objectContaining({ id: responseAccount.body.data.id }),
        category: expect.objectContaining({
          id: responseCategory.body.data.id,
        }),
      }),
    )
  })
})
