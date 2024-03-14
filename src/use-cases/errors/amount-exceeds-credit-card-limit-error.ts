// Transaction amount exceeds credit card limit
export class AmountExceedsCreditCardLimitError extends Error {
  constructor() {
    super('Transaction amount exceeds credit card limit')
  }
}
