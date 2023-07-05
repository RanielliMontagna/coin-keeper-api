import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get Transactions Graphics Week (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get transaction graphics week', async () => {
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

    for (let i = 1; i <= 2; i++) {
      await request(app.server)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Transaction Name ${i + 1}`,
          description: 'Transaction Example Description',
          amount: 1000,
          type: i % 2 === 0 ? 'EXPENSE' : 'INCOME',
          date: new Date(),
          accountId: responseAccount.body.data.id,
          categoryId: responseCategory.body.data.id,
        })
    }

    const response = await request(app.server)
      .get('/transactions/graphics/week')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual(
      expect.objectContaining({
        week: expect.arrayContaining([
          expect.objectContaining({
            balance: 0,
            incomes: 1000,
            expenses: 1000,
          }),
        ]),
      }),
    )
  })
})
