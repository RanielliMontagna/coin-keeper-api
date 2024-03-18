export class InvoiceNotOpenError extends Error {
  constructor() {
    super('Invoice is not open')
  }
}
