import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'

import { RegisterUserUseCase, UserTypeEnum } from './register-user'

let usersRepository: InMemoryUserRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  const organizationId = 'organization-id'

  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new RegisterUserUseCase(usersRepository, organizationRepository)

    await organizationRepository.create({
      id: organizationId,
      name: 'Organization Name',
    })
  })

  it('should be able to register a new user', async () => {
    const response = await sut.execute({
      name: 'User Name',
      email: 'user@name.com',
      type: UserTypeEnum.ADMIN,
      organizationId: organizationId,
    })

    expect(response.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'User Name',
        email: 'user@name.com',
        type: UserTypeEnum.ADMIN,
        organization_id: organizationId,
        photo: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to register a new user with a non-existing organization', async () => {
    await expect(
      sut.execute({
        name: 'User Name',
        email: 'user@name.com',
        type: UserTypeEnum.ADMIN,
        organizationId: 'non-existing-organization-id',
      }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })
})
