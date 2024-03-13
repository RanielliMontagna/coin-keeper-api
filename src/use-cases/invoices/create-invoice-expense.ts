import { InvoiceExpenses } from '@prisma/client'

import { InvoiceRepository } from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'

export interface CreateInvoiceExpenseUseCaseRequest {
  title: string
  description?: string
  amount: number

  date: Date

  invoiceId: string
  userId: string
}

interface InvoiceExpenseCreateInput {
  id: InvoiceExpenses['id']
  title: InvoiceExpenses['title']
  description: InvoiceExpenses['description']
  amount: InvoiceExpenses['amount']
  date: InvoiceExpenses['date']
  canceledAt?: InvoiceExpenses['canceled_at']

  invoiceId: InvoiceExpenses['invoice_id']
  userId: InvoiceExpenses['user_id']
}

export interface CreateInvoiceExpenseUseCaseResponse {
  invoiceExpense: InvoiceExpenseCreateInput
}

export class CreateInvoiceExpenseUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    title,
    description,
    amount,
    date,
    invoiceId,
    userId,
  }: CreateInvoiceExpenseUseCaseRequest): Promise<CreateInvoiceExpenseUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    const invoiceExpense = await this.invoiceRepository.createExpense({
      title,
      description,
      amount,
      date,
      invoice_id: invoiceId,
      user_id: userId,
    })

    return {
      invoiceExpense: {
        id: invoiceExpense.id,
        title: invoiceExpense.title,
        description: invoiceExpense.description,
        amount: invoiceExpense.amount,
        date: invoiceExpense.date,
        canceledAt: invoiceExpense.canceled_at || undefined,

        invoiceId: invoiceExpense.invoice_id,
        userId: invoiceExpense.user_id,
      },
    }
  }
}
