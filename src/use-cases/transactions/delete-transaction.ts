import { Transaction } from '@prisma/client'

import { TransactionRepository } from '@/repositories/transaction-repository'
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
}

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ transactionId }: DeleteTransactionUseCaseRequest) {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    await this.transactionRepository.delete(transactionId)
  }
}
