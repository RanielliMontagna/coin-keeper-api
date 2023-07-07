import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { ColorEnum } from '@/use-cases/categories/create-category'

describe('Fetch Categories (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch categories', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createCategoryResponse = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: ColorEnum.LIME,
      })

    const response = await request(app.server)
      .get('/categories')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        categories: expect.arrayContaining([
          expect.objectContaining({
            id: createCategoryResponse.body.data.id,
            name: 'Category Example',
            description: 'Category Example Description',
            color: ColorEnum.LIME,
          }),
        ]),
      },
    })
  })
})
