import { FastifyReply, FastifyRequest } from 'fastify'
import NodeCache from 'node-cache'

import { brapiInstance } from '@/lib/axios'
import { returnData } from '@/utils/http/returnData'

const cache = new NodeCache({ stdTTL: 60 * 10 }) // 10 minutes

export async function getQuotes(_: FastifyRequest, reply: FastifyReply) {
  try {
    const cachedData = cache.get('quotes')

    if (cachedData) {
      return reply.status(200).send(returnData(cachedData))
    }

    const promiseDollar = brapiInstance.get('/v2/currency?currency=USD-BRL')
    const promiseEuro = brapiInstance.get('/v2/currency?currency=EUR-BRL')
    const promiseBitcoin = brapiInstance.get('/v2/crypto?coin=BTC')
    const promiseIbovespa = brapiInstance.get('/quote/^BVSP')

    const [
      {
        data: { currency: dollarCurrency },
      },
      {
        data: { currency: euroCurrency },
      },
      {
        data: { coins: bitcoinCurrency },
      },
      {
        data: { results: ibovespaCurrency },
      },
    ] = await Promise.all([
      promiseDollar,
      promiseEuro,
      promiseBitcoin,
      promiseIbovespa,
    ])

    const data = {
      dollar: {
        price: dollarCurrency?.[0]?.bidPrice,
        variation: dollarCurrency?.[0]?.bidVariation,
      },
      euro: {
        price: euroCurrency?.[0]?.bidPrice,
        variation: euroCurrency?.[0]?.bidVariation,
      },
      bitcoin: {
        price: bitcoinCurrency?.[0]?.regularMarketPrice,
        variation: bitcoinCurrency?.[0]?.regularMarketChangePercent,
      },
      ibovespa: {
        price: ibovespaCurrency?.[0]?.regularMarketPrice,
        variation: ibovespaCurrency?.[0]?.regularMarketChangePercent,
      },
    }

    cache.set('quotes', data)

    return reply.status(200).send(returnData(data))
  } catch (err) {
    throw err
  }
}
