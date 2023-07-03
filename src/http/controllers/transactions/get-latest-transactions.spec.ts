import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { TransactionType } from '@/use-cases/transactions/create-transaction'

describe('Get Latest Transactions (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch latest transactions', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseAccount = await request(app.server)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Account Example',
        balance: 1000,
      })

    const responseCategory = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: 1,
      })

    for (let i = 0; i < 10; i++) {
      await request(app.server)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Transaction Example ${i}`,
          description: 'Transaction Example Description',
          amount: 1000,
          type: TransactionType.INCOME,
          date: new Date(),
          accountId: responseAccount.body.data.id,
          categoryId: responseCategory.body.data.id,
        })
    }

    const response = await request(app.server)
      .get(`/transactions/latest`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        transactions: expect.arrayContaining([
          expect.objectContaining({
            title: 'Transaction Example 4',
          }),
        ]),
      },
    })
  })
})
