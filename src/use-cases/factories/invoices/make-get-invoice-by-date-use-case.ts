import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { GetInvoiceByDateUseCase } from '@/use-cases/invoices/get-invoice-by-date'

export function makeGetInvoiceByDate() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetInvoiceByDateUseCase(invoiceRepository, userRepository)

  return useCase
}
