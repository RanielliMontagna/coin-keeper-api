import { CronJob } from 'cron'

export const cron = (cronTime: string, onTick: () => void) => {
  return new CronJob(cronTime, onTick, null, true)
}
