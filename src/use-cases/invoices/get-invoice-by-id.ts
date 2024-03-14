import {
  InvoiceRepository,
  InvoiceReturn,
} from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'

interface GetInvoiceByIdUseCaseRequest {
  invoiceId: string
  userId: string
}

interface GetInvoiceByIdUseCaseResponse {
  invoice: InvoiceReturn
}

export class GetInvoiceByIdUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    invoiceId,
  }: GetInvoiceByIdUseCaseRequest): Promise<GetInvoiceByIdUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    return { invoice }
  }
}
