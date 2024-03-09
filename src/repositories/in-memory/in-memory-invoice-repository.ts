import { CreditCard, Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import { InvoiceRepository } from '../invoice-repository'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { randomUUID } from 'crypto'
import { StatusInvoiceEnum } from '@/use-cases/invoices/create-invoice'

export class InMemoryInvoiceRepository implements InvoiceRepository {
  public invoices: Invoice[] = []
  public invoiceExpenses: InvoiceExpenses[] = []

  async create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice> {
    const newInvoice = {
      id: invoice.id || randomUUID(),
      status: invoice.status || StatusInvoiceEnum.OPEN,
      paidAmount: 0,
      partialAmount: 0,
      dueDate: new Date(invoice.dueDate),
      closingDate: new Date(invoice.closingDate),

      credit_card_id: invoice.credit_card_id,
      user_id: invoice.user_id,

      created_at: new Date(),
      updated_at: new Date(),
    } as Invoice

    return newInvoice
  }

  async createExpense(
    invoiceExpense: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses> {
    const invoice = this.invoices.find(
      (i) => i.id === invoiceExpense.invoice_id,
    )

    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    const newInvoiceExpense = { ...invoiceExpense, invoice } as InvoiceExpenses

    return newInvoiceExpense
  }
}
