import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Delete Category (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an category', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createCategoryResponse = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Category Example',
        description: 'Category Example Description',
        color: 1,
      })

    const response = await request(app.server)
      .delete(`/categories/${createCategoryResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(204)

    const getCategoryResponse = await request(app.server)
      .get(`/categories/${createCategoryResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getCategoryResponse.status).toEqual(400)
  })
})
