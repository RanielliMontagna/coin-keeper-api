import { RecurringTransactionRepository } from '@/repositories/recurring-transaction-repository'
import { RecurringTransactionNotFoundError } from '../errors/recurring-transaction-not-found-error'

interface DeleteRecurringTransactionUseCaseRequest {
  recurringTransactionId: string
}

export class DeleteRecurringTransactionUseCase {
  constructor(
    private recurringTransactionRepository: RecurringTransactionRepository,
  ) {}

  async execute({
    recurringTransactionId,
  }: DeleteRecurringTransactionUseCaseRequest) {
    const recurringTransaction =
      await this.recurringTransactionRepository.findById(recurringTransactionId)

    if (!recurringTransaction) {
      throw new RecurringTransactionNotFoundError()
    }

    await this.recurringTransactionRepository.delete(recurringTransactionId)
  }
}
