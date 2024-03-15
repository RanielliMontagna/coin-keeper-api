import {
  InvoiceRepository,
  InvoiceReturn,
} from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface GetInvoiceByDateUseCaseRequest {
  month: number
  year?: number

  userId: string
}

interface GetInvoiceByDateUseCaseResponse {
  invoice: InvoiceReturn
}

export class GetInvoiceByDateUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    month,
    year,
    userId,
  }: GetInvoiceByDateUseCaseRequest): Promise<GetInvoiceByDateUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoice = await this.invoiceRepository.findInvoiceByDate({
      month: month,
      year: year || new Date().getFullYear(),
    })

    return { invoice }
  }
}
