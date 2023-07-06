import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { ColorEnum } from '@/use-cases/categories/create-category'

describe('Create Category (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an category', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: ColorEnum.INDIGO,
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      data: {
        id: expect.any(String),
      },
    })
  })
})
