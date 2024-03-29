import dayjs from 'dayjs'

import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import {
  InvoiceByDate,
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

  async findInvoiceByDate({
    month,
    year,
    userId,
    creditCardId,
  }: InvoiceByDate): Promise<InvoiceReturn | null> {
    const firstDayOfMonth = dayjs(new Date(year, month - 1, 1)).toDate()
    const lastDayOfMonth = dayjs(new Date(year, month, 0)).toDate()

    const invoice = await prisma.invoice.findFirst({
      where: {
        dueDate: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        credit_card_id: creditCardId,
        user_id: userId,
      },
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

  async fetchInvoicesByDate({
    month,
    userId,
    year,
  }: InvoiceByDate): Promise<InvoiceReturn[]> {
    const firstDayOfMonth = dayjs(new Date(year, month - 1, 1)).toDate()
    const lastDayOfMonth = dayjs(new Date(year, month, 0)).toDate()

    const invoices = await prisma.invoice.findMany({
      where: {
        dueDate: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        user_id: userId,
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
