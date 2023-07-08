import request from 'supertest'

import { app } from '@/app'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { ColorEnum } from '@/use-cases/categories/create-category'
import { TransactionEnum } from '@/use-cases/transactions/create-transaction'

describe('Delete Transaction (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an transaction', async () => {
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

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Transaction Example',
        description: 'Transaction Example Description',
        amount: 1000,
        type: TransactionEnum.INCOME,
        date: '2021-01-01',
        accountId: responseAccount.body.data.id,
        categoryId: responseCategory.body.data.id,
      })

    const response = await request(app.server)
      .delete(`/transactions/${createTransactionResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(204)
  })
})
