import { CreditCard, Invoice, InvoiceExpenses, Prisma } from '@prisma/client'

interface InvoiceByDate {
  month: number
  year: number
}

export interface InvoiceReturn {
  id: Invoice['id']
  status: Invoice['status']
  paidAmount: Invoice['paidAmount']
  partialAmount: Invoice['partialAmount']
  dueDate: Invoice['dueDate']
  closingDate: Invoice['closingDate']
  creditCard: {
    id: CreditCard['id']
    name: CreditCard['name']
    flag: CreditCard['flag']
    limit: CreditCard['limit']
  }
}

export interface PartialAmountReturn {
  newPartialAmount: number
}

export interface InvoiceRepository {
  findById(id: string): Promise<InvoiceReturn | null>
  findInvoiceByDate(date: InvoiceByDate): Promise<InvoiceReturn>
  fetchInvoicesByDate(date: InvoiceByDate): Promise<InvoiceReturn[]>
  addPartialAmount(
    invoiceId: string,
    amount: number,
  ): Promise<PartialAmountReturn>

  create(invoice: Prisma.InvoiceUncheckedCreateInput): Promise<Invoice>
  createExpense(
    invoice: Prisma.InvoiceExpensesUncheckedCreateInput,
  ): Promise<InvoiceExpenses>
}
