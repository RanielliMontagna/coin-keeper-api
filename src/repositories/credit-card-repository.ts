import { CreditCard, Prisma } from '@prisma/client'

export interface CreditCardRepository {
  findById(id: string): Promise<CreditCard | null>
  findManyByUserId(userId: string): Promise<CreditCard[]>
  create(creditCard: Prisma.CreditCardUncheckedCreateInput): Promise<CreditCard>
  update(creditCard: Prisma.CreditCardUncheckedUpdateInput): Promise<CreditCard>
  delete(id: string): Promise<CreditCard>
}
