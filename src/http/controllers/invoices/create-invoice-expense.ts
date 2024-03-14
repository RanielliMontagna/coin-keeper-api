import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeCreateInvoiceExpenseUseCase } from '@/use-cases/factories/invoices/make-create-invoice-expense-use-case'
import { makeGetInvoiceById } from '@/use-cases/factories/invoices/make-get-invoice-by-id-use-case'
import { makeGetCreditCardUseCase } from '@/use-cases/factories/credit-cards/make-get-credit-card-use-case'
import { CreditCardNotFoundError } from '@/use-cases/errors/credit-card-not-found-error'
import { makeCreateInvoiceUseCase } from '@/use-cases/factories/invoices/make-create-invoice-use-case'
import dayjs from 'dayjs'
import { AmountExceedsCreditCardLimitError } from '@/use-cases/errors/amount-exceeds-credit-card-limit-error'
import { InvoiceNotOpenError } from '@/use-cases/errors/invoice-not-open-error'

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

  const getInvoiceUseCase = makeGetInvoiceById()
  const getCreditCardUseCase = makeGetCreditCardUseCase()

  const createInvoiceExpenseUseCase = makeCreateInvoiceExpenseUseCase()
  const createInvoiceUseCase = makeCreateInvoiceUseCase()

  try {
    if (body.invoiceId) {
      const { invoice } = await getInvoiceUseCase.execute({
        invoiceId: body.invoiceId || '',
        userId: request.user.sub,
      })

      const response = await createInvoiceExpenseUseCase.execute({
        title: body.title,
        amount: body.amount,
        date: new Date(body.date),
        description: body.description,
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
