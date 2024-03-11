import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

interface InvoiceByDate {
  month: number
  year: number
}
export interface InvoiceRepository {
  getInvoiceById(id: string): Promise<Invoice | null>
  fetchInvoicesByDate(date: InvoiceByDate): Promise<Invoice[]>

  create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  createExpense(
    invoice: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses>
}
