import { Invoice } from '@prisma/client'

import { InvoiceRepository } from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchInvoicesByDateUseCaseRequest {
  month: number
  year?: number

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

interface FetchInvoicesByDateUseCaseResponse {
  invoices: InvoiceReturn[]
}

export class FetchInvoicesByDateUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    month,
    year,
    userId,
  }: FetchInvoicesByDateUseCaseRequest): Promise<FetchInvoicesByDateUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoices = await this.invoiceRepository.fetchInvoicesByDate({
      month: month,
      year: year || new Date().getFullYear(),
    })

    return {
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        status: invoice.status,
        paidAmount: invoice.paidAmount,
        partialAmount: invoice.partialAmount,
        dueDate: invoice.dueDate,
        closingDate: invoice.closingDate,
        creditCardId: invoice.credit_card_id,
      })),
    }
  }
}
