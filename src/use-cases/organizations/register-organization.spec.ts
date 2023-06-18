import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization-repository'

import { RegisterOrganizationUseCase } from './register-organization'

let organizationRepository: InMemoryOrganizationRepository
let sut: RegisterOrganizationUseCase

describe('Register Organization Use Case', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new RegisterOrganizationUseCase(organizationRepository)
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
