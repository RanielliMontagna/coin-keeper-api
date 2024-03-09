import { Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

export interface InvoiceRepository {
  create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  createExpense(
    invoice: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses>
}
