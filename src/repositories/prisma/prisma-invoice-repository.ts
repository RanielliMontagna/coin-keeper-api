import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

import { InvoiceRepository } from '../invoice-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceRepository implements InvoiceRepository {
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
