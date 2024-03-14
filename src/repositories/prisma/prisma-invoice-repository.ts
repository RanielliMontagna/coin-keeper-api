import dayjs from 'dayjs'
import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import { InvoiceRepository } from '../invoice-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceRepository implements InvoiceRepository {
  async findById(id: string): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findUnique({ where: { id } })

    if (!invoice) return null

    return invoice
  }

  async fetchInvoicesByDate(date: {
    month: number
    year: number
  }): Promise<Invoice[]> {
    const firstDayOfMonth = dayjs(
      new Date(date.year, date.month - 1, 1),
    ).toDate()
    const lastDayOfMonth = dayjs(new Date(date.year, date.month, 0)).toDate()

    const invoices = await prisma.invoice.findMany({
      where: {
        dueDate: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    })

    return invoices
  }

  async create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice> {
    const createdInvoice = await prisma.invoice.create({
      data: invoice,
    })

    return createdInvoice
  }

  async createExpense(
    invoiceExpense: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses> {
    const createdInvoiceExpense = await prisma.invoiceExpenses.create({
      data: invoiceExpense,
    })

    return createdInvoiceExpense
  }
}
