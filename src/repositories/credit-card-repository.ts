import { Account, CreditCard, Prisma } from '@prisma/client'

interface CreditCardWithAccount {
  id: CreditCard['id']
  name: CreditCard['name']
  limit: CreditCard['limit']
  flag: CreditCard['flag']
  closingDay: CreditCard['closingDay']
  dueDay: CreditCard['dueDay']
  account: {
    id: Account['id']
    name: Account['name']
    institution: Account['institution']
  }
}

export interface CreditCardRepository {
  findById(id: string): Promise<CreditCardWithAccount | null>
  findManyByUserId(userId: string): Promise<CreditCardWithAccount[]>
  create(creditCard: Prisma.CreditCardUncheckedCreateInput): Promise<CreditCard>
  update(creditCard: Prisma.CreditCardUncheckedUpdateInput): Promise<CreditCard>
  delete(id: string): Promise<CreditCard>
}
