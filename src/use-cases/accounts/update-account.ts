import type { AccountRepository } from '@/repositories/account-repository'

import type {
  RegisterAccountUseCaseRequest,
  RegisterAccountUseCaseResponse,
} from './register-account'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

interface UpdateAccountCaseRequest
  extends Partial<RegisterAccountUseCaseRequest> {
  accountId: string
}

interface UpdateAccountCaseResponse extends RegisterAccountUseCaseResponse {}

export class UpdateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    balance,
    name,
    userId,
    accountId,
  }: UpdateAccountCaseRequest): Promise<UpdateAccountCaseResponse> {
    const account = await this.accountRepository.findById(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const updatedAccount = await this.accountRepository.update({
      id: accountId,
      name: name,
      balance: balance,
      user_id: userId,
    })

    return {
      account: updatedAccount,
    }
  }
}
