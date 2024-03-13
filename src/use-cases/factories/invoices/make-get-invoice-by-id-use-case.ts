import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { GetInvoiceByIdUseCase } from '@/use-cases/invoices/get-invoice-by-id'

export function makeGetInvoiceById() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new GetInvoiceByIdUseCase(invoiceRepository, userRepository)

  return useCase
}
