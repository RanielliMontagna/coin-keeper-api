import dayjs from 'dayjs'

import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import {
  InvoiceRepository,
  InvoiceReturn,
  PartialAmountReturn,
} from '../invoice-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceRepository implements InvoiceRepository {
  async addPartialAmount(
    invoiceId: string,
    amount: number,
  ): Promise<PartialAmountReturn> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { creditCard: true },
    })

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { partialAmount: invoice!.partialAmount + amount },
    })

    return { newPartialAmount: updatedInvoice.partialAmount }
  }

  async findById(id: string): Promise<InvoiceReturn | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { creditCard: true },
    })

    if (!invoice) return null

    const invoiceReturn: InvoiceReturn = {
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: invoice.creditCard.id,
        name: invoice.creditCard.name,
        flag: invoice.creditCard.flag,
        limit: invoice.creditCard.limit,
      },
    }

    return invoiceReturn
  }

  async fetchInvoicesByDate(date: {
    month: number
    year: number
  }): Promise<InvoiceReturn[]> {
    const firstDayOfMonth = dayjs(
      new Date(date.year, date.month - 1, 1),
    ).toDate()
    const lastDayOfMonth = dayjs(new Date(date.year, date.month, 0)).toDate()

    const invoices = await prisma.invoice.findMany({
      where: {
        dueDate: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
      include: { creditCard: true },
    })

    const invoicesReturn = invoices.map((invoice) => ({
      id: invoice.id,
      status: invoice.status,
      paidAmount: invoice.paidAmount,
      partialAmount: invoice.partialAmount,
      dueDate: invoice.dueDate,
      closingDate: invoice.closingDate,
      creditCard: {
        id: invoice.creditCard.id,
        name: invoice.creditCard.name,
        flag: invoice.creditCard.flag,
        limit: invoice.creditCard.limit,
      },
    }))

    return invoicesReturn
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
