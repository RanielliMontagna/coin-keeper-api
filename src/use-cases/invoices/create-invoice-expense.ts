import { InvoiceExpenses } from '@prisma/client'

import { InvoiceRepository } from '@/repositories/invoice-repository'
import { UserRepository } from '@/repositories/user-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { InvoiceNotOpenError } from '../errors/invoice-not-open-error'
import { StatusInvoiceEnum } from './create-invoice'
import { AmountExceedsCreditCardLimitError } from '../errors/amount-exceeds-credit-card-limit-error'

export interface CreateInvoiceExpenseUseCaseRequest {
  title: string
  description?: string
  amount: number

  date: Date

  userId: string
  invoiceId: string
  categoryId: string
}

interface InvoiceExpenseCreateInput {
  id: InvoiceExpenses['id']
  title: InvoiceExpenses['title']
  description: InvoiceExpenses['description']
  amount: InvoiceExpenses['amount']
  date: InvoiceExpenses['date']
  canceledAt?: InvoiceExpenses['canceled_at']

  category_id: InvoiceExpenses['category_id']
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
    categoryId,
  }: CreateInvoiceExpenseUseCaseRequest): Promise<CreateInvoiceExpenseUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const invoice = await this.invoiceRepository.findById(invoiceId)

    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    if (invoice.status === StatusInvoiceEnum.OPEN) {
      const totalInvoiceExpenses = invoice.partialAmount + amount
      const limit = invoice.creditCard.limit

      if (totalInvoiceExpenses > limit) {
        throw new AmountExceedsCreditCardLimitError()
      }
    } else {
      throw new InvoiceNotOpenError()
    }

    const invoiceExpense = await this.invoiceRepository.createExpense({
      title,
      description,
      amount,
      date,
      invoice_id: invoiceId,
      user_id: userId,
      category_id: categoryId,
    })

    return {
      invoiceExpense: {
        id: invoiceExpense.id,
        title: invoiceExpense.title,
        description: invoiceExpense.description,
        amount: invoiceExpense.amount,
        date: invoiceExpense.date,
        canceledAt: invoiceExpense.canceled_at || undefined,

        userId: invoiceExpense.user_id,
        invoiceId: invoiceExpense.invoice_id,
        category_id: invoiceExpense.category_id,
      },
    }
  }
}
