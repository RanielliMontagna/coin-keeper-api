import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { AddInvoiceAmountUseCase } from '@/use-cases/invoices/add-invoice-amount'

export function makeAddInvoiceAmountUseCase() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new AddInvoiceAmountUseCase(invoiceRepository, userRepository)

  return useCase
}
