import { cron } from '@/lib/cron'
import { prisma } from '@/lib/prisma'
import { StatusInvoiceEnum } from '@/use-cases/invoices/create-invoice'

async function invoicePaymentAutomation() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        status: StatusInvoiceEnum.OPEN,
        dueDate: { lte: new Date() },
      },
    })

    for (const invoice of invoices) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: StatusInvoiceEnum.OVERDUE },
      })
    }
  } catch (error) {
    throw error
  }
}

invoicePaymentAutomation()

// Run the job every day in first minute of the day
cron('0 0 * * *', invoicePaymentAutomation)
