import { Account } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchAccountsUseCaseRequest {
  userId: string
}

interface FetchAccountsUseCaseResponse {
  accounts: {
    id: Account['id']
    name: Account['name']
    balance: Account['balance']
  }[]
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
      accounts: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        balance: account.balance,
      })),
    }
  }
}
