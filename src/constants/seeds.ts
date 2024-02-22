import { InstitutionEnum } from '@/use-cases/accounts/create-account'
import { ColorEnum } from '@/use-cases/categories/create-category'
import { Prisma } from '@prisma/client'

export const account: Prisma.AccountUncheckedCreateWithoutUserInput = {
  name: 'Wallet',
  balance: 0,
  institution: InstitutionEnum.OTHER,
}

export const categories: Prisma.CategoryCreateWithoutUserInput[] = [
  {
    name: 'Housing',
    color: ColorEnum.RED,
    description: 'Expenses for your living arrangements.',
  },
  {
    name: 'Transportation',
    color: ColorEnum.ORANGE,
    description: 'Costs related to getting around.',
  },
  {
    name: 'Education',
    color: ColorEnum.LIGHT_BLUE,
    description: 'Expenses for schooling and personal development.',
  },
  {
    name: 'Clothing',
    color: ColorEnum.BLUE,
    description: 'Costs for clothing and accessories.',
  },
  {
    name: 'Eletronics',
    color: ColorEnum.PURPLE,
    description: 'Expenses for electronic devices and gadgets.',
  },
  {
    name: 'Entertainment',
    color: ColorEnum.PINK,
    description: 'Spending on leisure activities and recreation.',
  },
  {
    name: 'Streaming',
    color: ColorEnum.PINK,
    description: 'Costs for streaming services.',
  },
  {
    name: 'Food',
    color: ColorEnum.BROWN,
    description: 'Expenses for groceries and dining.',
  },
  {
    name: 'Medical & Healthcare',
    color: ColorEnum.LIGHT_GREEN,
    description: 'Costs for medical care and health insurance.',
  },
  {
    name: 'Saving & Investing',
    color: ColorEnum.GREEN,
    description: 'Contributions towards savings and investments.',
  },
  {
    name: 'Recreation & Entertainment',
    color: ColorEnum.TEAL,
    description: 'Expenses for recreational activities.',
  },
  {
    name: 'Others',
    color: ColorEnum.GREY,
    description: 'Miscellaneous expenses not fitting in other categories.',
  },
]

export const configs: Prisma.ConfigCreateWithoutUserInput[] = [
  {
    // Config to mark future transactions as paid automatically on the day it was set
    key: 'auto_mark_as_paid',
    value: 'false',
  },
]
