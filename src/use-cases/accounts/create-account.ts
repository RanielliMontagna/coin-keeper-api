import type { Account } from '@prisma/client'

import type { AccountRepository } from '@/repositories/account-repository'
import type { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export interface CreateAccountUseCaseRequest {
  name: string
  balance: number
  userId: string
}

export interface CreateAccountUseCaseResponse {
  account: Account
}

export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    balance,
    name,
    userId,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const account = await this.accountRepository.create({
      name: name,
      balance: balance,
      user_id: userId,
    })

    return {
      account,
    }
  }
}
