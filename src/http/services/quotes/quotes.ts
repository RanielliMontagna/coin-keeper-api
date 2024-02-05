import { FastifyReply, FastifyRequest } from 'fastify'
import NodeCache from 'node-cache'

import { returnData } from '@/utils/http/returnData'
import { awesomeApi } from '@/lib/axios'

const cache = new NodeCache({ stdTTL: 60 * 10 }) // 10 minutes

export async function getQuotes(_: FastifyRequest, reply: FastifyReply) {
  try {
    const cachedData = cache.get('quotes')

    if (cachedData) {
      return reply.status(200).send(returnData(cachedData))
    }

    const promiseDollar = awesomeApi.get('/last/USD-BRL,EUR-BRL,BTC-BRL')
    const [
      {
        data: { USDBRL, EURBRL, BTCBRL },
      },
    ] = await Promise.all([promiseDollar])

    const data = {
      dollar: {
        price: USDBRL?.bid,
        variation: USDBRL?.pctChange,
      },
      euro: {
        price: EURBRL?.bid,
        variation: EURBRL?.pctChange,
      },
      bitcoin: {
        price: BTCBRL?.bid,
        variation: BTCBRL?.pctChange,
      },
      //TODO: Add IBOVESPA
      ibovespa: { price: 0, variation: 0 },
    }

    cache.set('quotes', data)

    return reply.status(200).send(returnData(data))
  } catch (err) {
    throw err
  }
}
