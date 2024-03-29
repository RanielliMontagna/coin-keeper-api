import {
  InvoiceRepository,
  InvoiceReturn,
} from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface FetchInvoicesByDateUseCaseRequest {
  month: number
  year?: number

  userId: string
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
      userId,
    })

    return { invoices }
  }
}
