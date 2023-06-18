import { Account } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchAccountsUseCaseRequest {
  userId: string
}

interface FetchAccountsUseCaseResponse {
  accounts: Account[]
}

export class FetchAccountsUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const accounts = await this.accountRepository.findManyByUserId(userId)

    return {
      accounts: accounts,
    }
  }
}
