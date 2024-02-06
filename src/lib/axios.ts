import axios from 'axios'

const awesomeApi = axios.create({
  baseURL: 'https://economia.awesomeapi.com.br/json',
})

const apiKey = process.env.RAPIDAPI_KEY

const yahooApi = axios.create({
  baseURL: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2',
  headers: {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
  },
})

export { awesomeApi, yahooApi }
