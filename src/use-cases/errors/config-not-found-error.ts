export class ConfigNotFoundError extends Error {
  constructor() {
    super('Config not found')
  }
}
