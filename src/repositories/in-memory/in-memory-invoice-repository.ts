import { CreditCard, Invoice, InvoiceExpenses, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import {
  InvoiceByDate,
  InvoiceRepository,
  InvoiceReturn,
  PartialAmountReturn,
} from '../invoice-repository'

import { StatusInvoiceEnum } from '@/use-cases/invoices/create-invoice'
import { FlagEnum } from '@/use-cases/credit-card/create-credit-card'

export class InMemoryInvoiceRepository implements InvoiceRepository {
  public invoices: Invoice[] = []
  public invoiceExpenses: InvoiceExpenses[] = []
  public creditCards: CreditCard[] = []

  async addPartialAmount(
    invoiceId: string,
    amount: number,
  ): Promise<PartialAmountReturn> {
    const invoice = this.invoices.find((invoice) => invoice.id === invoiceId)

    invoice!.partialAmount += amount

    return { newPartialAmount: invoice!.partialAmount }
  }

  async findById(id: string): Promise<InvoiceReturn | null> {
    const invoice = this.invoices.find((invoice) => invoice.id === id)

    if (!invoice) return null

    return {
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: 'credit_card_id',
        name: 'credit_card_name',
        flag: FlagEnum.VISA,
        limit: 1000,
      },
    }
  }

  async findInvoiceByDate(props: InvoiceByDate): Promise<InvoiceReturn | null> {
    const invoice = this.invoices.find((invoice) => {
      if (props.creditCardId) {
        return (
          invoice.dueDate.getMonth() === props.month - 1 &&
          invoice.dueDate.getFullYear() === props.year &&
          invoice.credit_card_id === props.creditCardId &&
          invoice.user_id === props.userId
        )
      }

      return (
        invoice.dueDate.getMonth() === props.month - 1 &&
        invoice.dueDate.getFullYear() === props.year
      )
    })

    if (!invoice) return null

    return {
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: 'credit_card_id',
        name: 'credit_card_name',
        flag: FlagEnum.VISA,
        limit: 1000,
      },
    }
  }

  async fetchInvoicesByDate(payload: InvoiceByDate): Promise<InvoiceReturn[]> {
    const invoices = this.invoices.filter(
      (invoice) =>
        invoice.dueDate.getMonth() === payload.month - 1 &&
        invoice.dueDate.getFullYear() === payload.year &&
        invoice.user_id === payload.userId,
    )

    return invoices.map((invoice) => ({
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: 'credit_card_id',
        name: 'credit_card_name',
        flag: FlagEnum.VISA,
        limit: 1000,
      },
    }))
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
