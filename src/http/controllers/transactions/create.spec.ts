import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Transaction (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a transaction', async () => {
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

    const response = await request(app.server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Transaction Example',
        description: 'Transaction Example Description',
        amount: 1000,
        type: 'INCOME',
        date: '2021-01-01',
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
