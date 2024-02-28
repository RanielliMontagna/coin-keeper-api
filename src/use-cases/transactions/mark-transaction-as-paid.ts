import { TransactionRepository } from '@/repositories/transaction-repository'
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found-error'

interface MarkTransactionAsPaidUseCaseRequest {
  transactionId: string
}

interface MarkTransactionAsPaidUseCaseResponse {
  id: string
  isPaid: boolean
}

export class MarkTransactionAsPaidUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    transactionId,
  }: MarkTransactionAsPaidUseCaseRequest): Promise<MarkTransactionAsPaidUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      throw new TransactionNotFoundError()
    }

    await this.transactionRepository.markAsPaid(transactionId)

    return { id: transactionId, isPaid: true }
  }
}
