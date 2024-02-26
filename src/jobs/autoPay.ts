import { cron } from '@/lib/cron'
import { prisma } from '@/lib/prisma'

async function autoPay() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        is_paid: false,
        date: {
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        user: { include: { Config: true } },
      },
    })

    for (const transaction of transactions) {
      const autoMarkAsPaid = transaction.user.Config.find(
        (config) => config.key === 'auto_mark_as_paid',
      )?.value

      if (autoMarkAsPaid === 'true') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { is_paid: true },
        })
      }
    }
  } catch (error) {
    throw error
  }
}

// Run the job every day at 3am or when the server starts
cron('0 3 * * *', autoPay)

// Run the job when the server starts
autoPay()
