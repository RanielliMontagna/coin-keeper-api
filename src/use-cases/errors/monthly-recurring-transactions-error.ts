export class MonthlyRecurringTransactionsError extends Error {
  constructor() {
    super(
      'Error trying to create monthly recurring transactions with less than 2 months',
    )
  }
}
