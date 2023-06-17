import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization-repository'

import { RegisterOrganizationCase } from './register-organization'

let organizationReposistory: InMemoryOrganizationRepository
let sut: RegisterOrganizationCase

describe('Register Organization Use Case', () => {
  beforeEach(() => {
    organizationReposistory = new InMemoryOrganizationRepository()
    sut = new RegisterOrganizationCase(organizationReposistory)
  })

  it('should be able to register a new organization', async () => {
    const response = await sut.execute({
      name: 'Organization Name',
    })

    expect(response.organization).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Organization Name',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })
})
