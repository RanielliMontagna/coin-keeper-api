import axios from 'axios'

const brapiInstance = axios.create({
  baseURL: 'https://brapi.dev/api',
})

export { brapiInstance }
