import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { FetchInvoicesByDateUseCase } from '@/use-cases/invoices/fetch-invoices-by-date'

export function makeFetchInvoicesByDate() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new FetchInvoicesByDateUseCase(
    invoiceRepository,
    userRepository,
  )

  return useCase
}
