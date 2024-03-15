import { FastifyReply, FastifyRequest } from 'fastify'
import dayjs from 'dayjs'
import { z } from 'zod'

import { makeCreateInvoiceUseCase } from '@/use-cases/factories/invoices/make-create-invoice-use-case'
import { makeGetCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-get-credit-card-use-case'
import { makeCreateInvoiceExpenseUseCase } from '@/use-cases/factories/invoices/make-create-invoice-expense-use-case'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvoiceNotOpenError } from '@/use-cases/errors/invoice-not-open-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'
import { AmountExceedsCreditCardLimitError } from '@/use-cases/errors/amount-exceeds-credit-card-limit-error'
import { makeAddInvoiceAmountUseCase } from '@/use-cases/factories/invoices/make-add-invoice-amount-use-case'
import { makeGetInvoiceByDate } from '@/use-cases/factories/invoices/make-get-invoice-by-date-use-case'

export async function createInvoiceExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createInvoiceExpenseBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number(),
    date: z.string(),

    invoiceId: z.string().optional(),
  })

  const createInvoiceExpenseParamsSchema = z.object({
    creditCardId: z.string(),
  })

  const body = createInvoiceExpenseBodySchema.parse(request.body)
  const params = createInvoiceExpenseParamsSchema.parse(request.params)

  const getCreditCardUseCase = makeGetCreditCardUseCase()

  const createInvoiceExpenseUseCase = makeCreateInvoiceExpenseUseCase()
  const createInvoiceUseCase = makeCreateInvoiceUseCase()
  const addInvoiceAmountUseCase = makeAddInvoiceAmountUseCase()
  const getInvoiceByDateUseCase = makeGetInvoiceByDate()

  try {
    const { invoice } = await getInvoiceByDateUseCase.execute({
      month: dayjs(body.date).month() + 1,
      year: dayjs(body.date).year(),
      userId: request.user.sub,
      creditCardId: params.creditCardId,
    })

    if (invoice?.id) {
      const response = await createInvoiceExpenseUseCase.execute({
        title: body.title,
        amount: body.amount,
        date: new Date(body.date),
        description: body.description,
        invoiceId: invoice.id,
        userId: request.user.sub,
      })

      await addInvoiceAmountUseCase.execute({
        amount: body.amount,
        invoiceId: invoice.id,
        userId: request.user.sub,
      })

      return reply.status(201).send(response)
    } else {
      const { creditCard } = await getCreditCardUseCase.execute({
        creditCardId: params.creditCardId,
        userId: request.user.sub,
      })

      const closingDate = dayjs()
        .date(creditCard.closingDay)
        .format('YYYY-MM-DD')
        .toString()
      const dueDate = dayjs()
        .date(creditCard.dueDay)
        .format('YYYY-MM-DD')
        .toString()

      const { invoice } = await createInvoiceUseCase.execute({
        closingDate: new Date(closingDate),
        dueDate: new Date(dueDate),
        userId: request.user.sub,
        creditCardId: creditCard.id,
      })

      const response = await createInvoiceExpenseUseCase.execute({
        title: body.title,
        amount: body.amount,
        date: new Date(body.date),
        description: body.description,
        invoiceId: invoice.id,
        userId: request.user.sub,
      })

      await addInvoiceAmountUseCase.execute({
        amount: body.amount,
        invoiceId: invoice.id,
        userId: request.user.sub,
      })

      return reply.status(201).send(response)
    }
  } catch (err) {
    if (
      err instanceof UserNotFoundError ||
      err instanceof InvoiceNotFoundError ||
      err instanceof CreditCardNotFoundError ||
      err instanceof AmountExceedsCreditCardLimitError ||
      err instanceof InvoiceNotOpenError
    ) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
