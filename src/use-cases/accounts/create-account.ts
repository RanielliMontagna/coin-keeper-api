import type { Account } from '@prisma/client'

import type { AccountRepository } from '@/repositories/account-repository'
import type { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export enum InstitutionEnum {
  OTHER = 0,
  NUBANK = 1,
  XP = 2,
  ITAU = 3,
  BRADESCO = 4,
  SANTANDER = 5,
  BANCO_DO_BRASIL = 6,
  CAIXA = 7,
  INTER = 8,
  SICOOB = 9,
  SICREDI = 10,
}
export interface CreateAccountUseCaseRequest {
  name: string
  institution: InstitutionEnum
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
    institution,
    userId,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const account = await this.accountRepository.create({
      name: name,
      institution: institution,
      balance: balance,
      user_id: userId,
    })

    return { account }
  }
}
