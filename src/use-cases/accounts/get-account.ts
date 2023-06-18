import { Account } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

interface GetAccountUseCaseRequest {
  userId: string
  accountId: string
}

interface GetAccountUseCaseResponse {
  account: Account
}

export class GetAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    accountId,
  }: GetAccountUseCaseRequest): Promise<GetAccountUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    return { account }
  }
}
