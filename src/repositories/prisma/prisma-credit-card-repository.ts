import { prisma } from '@/lib/prisma'
import { CreditCardRepository } from '../credit-card-repository'
import { Prisma } from '@prisma/client'

export class PrismaCreditCardRepository implements CreditCardRepository {
  async findById(id: string) {
    const creditCard = await prisma.creditCard.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        limit: true,
        flag: true,
        closingDay: true,
        dueDay: true,
        account: {
          select: {
            id: true,
            name: true,
            institution: true,
          },
        },
        deleted_at: true,
      },
    })

    if (!creditCard) return null
    if (creditCard.deleted_at) return null

    return creditCard
  }

  async findManyByUserId(userId: string) {
    const categories = await prisma.creditCard.findMany({
      where: { user_id: userId, deleted_at: null },
      select: {
        id: true,
        name: true,
        limit: true,
        flag: true,
        closingDay: true,
        dueDay: true,
        account: {
          select: {
            id: true,
            name: true,
            institution: true,
          },
        },
      },
    })

    return categories
  }

  async create(creditCard: Prisma.CreditCardUncheckedCreateInput) {
    const createdCreditCard = await prisma.creditCard.create({
      data: creditCard,
    })

    return createdCreditCard
  }

  async update(creditCard: Prisma.CreditCardUncheckedUpdateInput) {
    const updatedCreditCard = await prisma.creditCard.update({
      where: { id: creditCard.id as string },
      data: creditCard,
    })

    return updatedCreditCard
  }

  async delete(id: string) {
    await prisma.creditCard.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }
}
