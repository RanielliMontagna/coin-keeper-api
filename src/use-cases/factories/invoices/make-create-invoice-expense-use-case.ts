import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { CreateInvoiceExpenseUseCase } from '@/use-cases/invoices/create-invoice-expense'

export function makeCreateInvoiceExpenseUseCase() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new CreateInvoiceExpenseUseCase(
    invoiceRepository,
    userRepository,
  )

  return useCase
}
