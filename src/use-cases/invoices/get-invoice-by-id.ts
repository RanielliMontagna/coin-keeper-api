import { Invoice } from '@prisma/client'

import { InvoiceRepository } from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'

interface GetInvoiceByIdUseCaseRequest {
  invoiceId: string
  userId: string
}

interface InvoiceReturn {
  id: Invoice['id']
  status: Invoice['status']
  paidAmount: Invoice['paidAmount']
  partialAmount: Invoice['partialAmount']
  dueDate: Invoice['dueDate']
  closingDate: Invoice['closingDate']
  creditCardId: Invoice['credit_card_id']
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

    return {
      invoice: {
        id: invoice.id,
        status: invoice.status,
        paidAmount: invoice.paidAmount,
        partialAmount: invoice.partialAmount,
        dueDate: invoice.dueDate,
        closingDate: invoice.closingDate,
        creditCardId: invoice.credit_card_id,
      },
    }
  }
}
