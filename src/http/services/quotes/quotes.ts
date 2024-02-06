import { FastifyReply, FastifyRequest } from 'fastify'
import NodeCache from 'node-cache'

import { returnData } from '@/utils/http/returnData'
import { awesomeApi, yahooApi } from '@/lib/axios'

const awesomeApiCache = new NodeCache({ stdTTL: 60 * 10 }) // 10 minutes
const yahooApiCache = new NodeCache({ stdTTL: 60 * 60 }) // 1 hour

export async function getQuotes(_: FastifyRequest, reply: FastifyReply) {
  try {
    const cachedAwesomeData = awesomeApiCache.get('awesomeApi')
    const cachedYahooData = yahooApiCache.get('yahooApi')

    if (cachedAwesomeData && cachedYahooData) {
      const data = { ...cachedAwesomeData, ...cachedYahooData }
      return reply.status(200).send(returnData(data))
    }

    const {
      data: { USDBRL, EURBRL, BTCBRL },
    } = await awesomeApi.get('/last/USD-BRL,EUR-BRL,BTC-BRL')

    const awesomeData = {
      dollar: {
        price: Number(USDBRL?.bid),
        variation: Number(USDBRL?.pctChange),
      },
      euro: {
        price: Number(EURBRL?.bid),
        variation: Number(EURBRL?.pctChange),
      },
      bitcoin: {
        price: Number(BTCBRL?.bid),
        variation: Number(BTCBRL?.pctChange),
      },
    }

    awesomeApiCache.set('awesomeApi', awesomeData)

    if (cachedYahooData) {
      const data = { ...awesomeData, ...cachedYahooData }
      return reply.status(200).send(returnData(data))
    }

    const {
      data: { quoteResponse },
    } = await yahooApi.get('/get-quotes', {
      params: { region: 'BR', symbols: '^BVSP' },
    })

    const yahooData = {
      ibovespa: {
        price: quoteResponse?.result?.[0]?.regularMarketPrice || 0,
        variation: quoteResponse?.result?.[0]?.regularMarketChangePercent || 0,
      },
    }

    yahooApiCache.set('yahooApi', yahooData)

    const data = { ...awesomeData, ...yahooData }
    return reply.status(200).send(returnData(data))
  } catch (err) {
    throw err
  }
}
