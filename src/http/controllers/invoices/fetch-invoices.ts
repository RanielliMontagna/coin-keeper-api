import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchInvoicesByDate } from '@/use-cases/factories/invoices/make-fetch-invoices-by-date-use-case'
import { returnData } from '@/utils/http/returnData'

export async function fetchInvoices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchInvoicesParamsSchema = z.object({
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2023).max(2100).optional(),
  })

  const params = fetchInvoicesParamsSchema.parse(request.query)

  const fetchInvoicesUseCase = makeFetchInvoicesByDate()

  const { invoices } = await fetchInvoicesUseCase.execute({
    month: params.month,
    year: params.year,
    userId: request.user.sub,
  })

  return reply.status(200).send(returnData({ invoices }))
}
