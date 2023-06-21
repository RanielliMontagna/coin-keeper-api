import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

import { RegisterUserUseCase, UserTypeEnum } from './register-user'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

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
    const { user } = await sut.execute({
      name: 'User Name',
      email: 'user@name.com',
      photo: 'http://photo.com',
      organizationId,
      googleId: 'google-id',
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'User Name',
        email: 'user@name.com',
        photo: 'http://photo.com',
        type: UserTypeEnum.GUEST,
        organization_id: organizationId,
        google_id: 'google-id',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should be able to register a new user without organization', async () => {
    const { user } = await sut.execute({
      name: 'User Name',
      email: 'user@name.com',
      photo: 'http://photo.com',
      googleId: 'google-id',
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'User Name',
        email: 'user@name.com',
        photo: 'http://photo.com',
        type: UserTypeEnum.ADMIN,
        organization_id: expect.any(String),
        google_id: 'google-id',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be able to register a new user with an inexistent organization', async () => {
    await expect(
      sut.execute({
        name: 'User Name',
        email: 'user@name.com',
        photo: 'http://photo.com',
        organizationId: 'inexistent-organization-id',
        googleId: 'google-id',
      }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })

  it('should not be able to register a new user with same email from another', async () => {
    await usersRepository.create({
      name: 'User Name',
      email: 'user@name.com',
      photo: 'http://photo.com',
      organization_id: organizationId,
      google_id: 'google-id',
      type: UserTypeEnum.ADMIN,
    })

    await expect(
      sut.execute({
        name: 'User Name',
        email: 'user@name.com',
        photo: 'http://photo.com',
        organizationId,
        googleId: 'google-id',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
