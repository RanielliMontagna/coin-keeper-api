import type { AccountRepository } from '@/repositories/account-repository'

import type {
  CreateAccountUseCaseRequest,
  CreateAccountUseCaseResponse,
} from './create-account'

import { AccountNotFoundError } from '@/use-cases/errors/account-not-found-error'

interface UpdateAccountCaseRequest
  extends Partial<CreateAccountUseCaseRequest> {
  accountId: string
}

interface UpdateAccountCaseResponse extends CreateAccountUseCaseResponse {}

export class UpdateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    balance,
    name,
    institution,
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
      institution: institution,
      balance: balance,
      user_id: userId,
    })

    return { account: updatedAccount }
  }
}
