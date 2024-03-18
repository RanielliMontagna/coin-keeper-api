import { UserRepository } from '@/repositories/user-repository'
import { InvoiceRepository } from '@/repositories/invoice-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { AmountExceedsCreditCardLimitError } from '../errors/amount-exceeds-credit-card-limit-error'

export interface AddInvoiceAmountUseCaseRequest {
  invoiceId: string
  userId: string
  amount: number
}

export interface AddInvoiceAmountUseCaseResponse {
  newPartialAmount: number
}

export class AddInvoiceAmountUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    amount,
    invoiceId,
    userId,
  }: AddInvoiceAmountUseCaseRequest): Promise<AddInvoiceAmountUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    const totalInvoiceExpenses = invoice.partialAmount + amount
    const limit = invoice.creditCard.limit

    if (totalInvoiceExpenses > limit) {
      throw new AmountExceedsCreditCardLimitError()
    }

    const updatedInvoice = await this.invoiceRepository.addPartialAmount(
      invoiceId,
      amount,
    )

    return { newPartialAmount: updatedInvoice.newPartialAmount }
  }
}
