import request from 'supertest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { Config } from '@prisma/client'

describe('Update All Configs (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update all configs', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const fetchResponse = await request(app.server)
      .get('/configs')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const response = await request(app.server)
      .put('/configs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        configs: fetchResponse.body.data.configs.map((c: Config) => ({
          id: c.id,
          key: c.key,
          value: 'new-value',
        })),
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      data: {
        updatedCount: expect.any(Number),
      },
    })
  })
})
