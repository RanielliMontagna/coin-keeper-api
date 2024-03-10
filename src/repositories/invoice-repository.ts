import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

export interface InvoiceRepository {
  getInvoiceById(id: string): Promise<Invoice | null>

  create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  createExpense(
    invoice: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses>
}
