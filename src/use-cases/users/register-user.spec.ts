import { compare } from 'bcryptjs'

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
      password: 'password',
      organizationId,
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'User Name',
        email: 'user@name.com',
        password_hash: expect.any(String),
        type: UserTypeEnum.GUEST,
        organization_id: organizationId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )

    const passwordMatch = await compare('password', user.password_hash)

    expect(passwordMatch).toBe(true)
  })

  it('should be able to register a new user without organization', async () => {
    const { user } = await sut.execute({
      name: 'User Name',
      email: 'user@name.com',
      password: 'password',
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'User Name',
        email: 'user@name.com',
        password_hash: expect.any(String),
        type: UserTypeEnum.ADMIN,
        organization_id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )

    const passwordMatch = await compare('password', user.password_hash)

    expect(passwordMatch).toBe(true)
  })

  it('should not be able to register a new user with an inexistent organization', async () => {
    await expect(
      sut.execute({
        name: 'User Name',
        email: 'user@name.com',
        organizationId: 'inexistent-organization-id',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError)
  })

  it('should not be able to register a new user with same email from another', async () => {
    await usersRepository.create({
      name: 'User Name',
      email: 'user@name.com',
      organization_id: organizationId,
      type: UserTypeEnum.ADMIN,
      password_hash: 'password-hash',
    })

    await expect(
      sut.execute({
        name: 'User Name',
        email: 'user@name.com',
        organizationId,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
