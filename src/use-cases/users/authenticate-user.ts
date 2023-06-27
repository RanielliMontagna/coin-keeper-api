import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

import { UserRepository } from '@/repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

export interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

export interface AuthenticateUserUseCaseResponse {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatch = await compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
