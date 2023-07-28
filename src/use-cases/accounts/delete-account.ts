import { Account } from '@prisma/client'

import { AccountRepository } from '@/repositories/account-repository'
import { AccountNotFoundError } from '../errors/account-not-found-error'

interface DeleteAccountUseCaseRequest {
  accountId: string
}

export class DeleteAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({ accountId }: DeleteAccountUseCaseRequest): Promise<void> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    await this.accountRepository.delete(accountId)
  }
}
