import axios from 'axios'

const awesomeApi = axios.create({
  baseURL: 'https://economia.awesomeapi.com.br/json',
})

export { awesomeApi }
