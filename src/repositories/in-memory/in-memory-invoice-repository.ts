import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import { InvoiceRepository } from '../invoice-repository'
import { randomUUID } from 'crypto'
import { StatusInvoiceEnum } from '@/use-cases/invoices/create-invoice'

export class InMemoryInvoiceRepository implements InvoiceRepository {
  public invoices: Invoice[] = []
  public invoiceExpenses: InvoiceExpenses[] = []

  async findById(id: string): Promise<Invoice | null> {
    const invoice = this.invoices.find((invoice) => invoice.id === id)

    if (!invoice) return null

    return invoice
  }

  async fetchInvoicesByDate(date: {
    month: number
    year: number
  }): Promise<Invoice[]> {
    const invoices = this.invoices.filter(
      (invoice) =>
        invoice.dueDate.getMonth() === date.month - 1 &&
        invoice.dueDate.getFullYear() === date.year,
    )

    return invoices
  }

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

    this.invoices.push(newInvoice)

    return newInvoice
  }

  async createExpense(
    invoiceExpense: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses> {
    const newInvoiceExpense = {
      id: invoiceExpense.id || randomUUID(),
      title: invoiceExpense.title,
      description: invoiceExpense.description,
      amount: invoiceExpense.amount,
      date: new Date(invoiceExpense.date),
      canceled_at: invoiceExpense.canceled_at,

      invoice_id: invoiceExpense.invoice_id,
      user_id: invoiceExpense.user_id,

      created_at: new Date(),
      updated_at: new Date(),

      recurring_transaction_id: invoiceExpense.recurring_transaction_id || null,
    } as InvoiceExpenses

    this.invoiceExpenses.push(newInvoiceExpense)

    return newInvoiceExpense
  }
}
