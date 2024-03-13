import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoice-repository'
import { PrismaCreditCardRepository } from '@/repositories/prisma/prisma-credit-card-repository'

import { CreateInvoiceUseCase } from '@/use-cases/invoices/create-invoice'

export function makeCreateInvoiceUseCase() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const creditCardRepository = new PrismaCreditCardRepository()
  const userRepository = new PrismaUserRepository()

  const useCase = new CreateInvoiceUseCase(
    invoiceRepository,
    creditCardRepository,
    userRepository,
  )

  return useCase
}
