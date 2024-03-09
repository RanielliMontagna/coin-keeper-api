import { Invoice } from '@prisma/client'

import { CreditCardRepository } from '@/repositories/credit-card-repository'
import { InvoiceRepository } from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { CreditCardNotFoundError } from '../errors/credit-card-not-found-error'

export interface CreateInvoiceUseCaseRequest {
  closingDate: Date
  dueDate: Date

  creditCardId: string
  userId: string
}

export enum StatusInvoiceEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  OVERDUE = 'OVERDUE',
}

interface InvoiceCreateInput {
  id: Invoice['id']
  closingDate: Invoice['closingDate']
  dueDate: Invoice['dueDate']
  status: Invoice['status']
  creditCardId: Invoice['credit_card_id']
  userId: Invoice['user_id']
}

export interface CreateInvoiceUseCaseResponse {
  invoice: InvoiceCreateInput
}

export class CreateInvoiceUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private creditCardRepository: CreditCardRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    closingDate,
    dueDate,
    userId,
    creditCardId,
  }: CreateInvoiceUseCaseRequest): Promise<CreateInvoiceUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const creditCard = await this.creditCardRepository.findById(creditCardId)

    if (!creditCard) {
      throw new CreditCardNotFoundError()
    }

    const invoice = await this.invoiceRepository.create({
      closingDate,
      dueDate,
      credit_card_id: creditCardId,
      user_id: userId,
    })

    console.log(invoice)

    return {
      invoice: {
        id: invoice.id,
        closingDate: invoice.closingDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        creditCardId: invoice.credit_card_id,
        userId: invoice.user_id,
      },
    }
  }
}
