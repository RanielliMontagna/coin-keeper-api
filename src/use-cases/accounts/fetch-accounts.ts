import { Account } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { Options } from '../options/options'

interface FetchAccountsUseCaseRequest {
  userId: string
  options?: Pick<Options, 'search'>
}

interface FetchAccountsUseCaseResponse {
  accounts: {
    id: Account['id']
    name: Account['name']
    institution: Account['institution']
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
    options,
  }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const accounts = await this.accountRepository.findManyByUserId(
      userId,
      options,
    )

    return {
      accounts: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        institution: account.institution,
        balance: account.balance,
      })),
    }
  }
}
