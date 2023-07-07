import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { ColorEnum } from '@/use-cases/categories/create-category'

describe('Create Update (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update an category', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: ColorEnum.INDIGO,
      })

    const updateResponse = await request(app.server)
      .put(`/categories/${response.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example Updated',
        description: 'Category Example Description Updated',
        color: ColorEnum.RED,
      })

    expect(updateResponse.status).toEqual(200)
    expect(updateResponse.body).toEqual({
      data: expect.objectContaining({
        id: response.body.data.id,
        name: 'Category Example Updated',
        description: 'Category Example Description Updated',
        color: ColorEnum.RED,
      }),
    })
  })
})
