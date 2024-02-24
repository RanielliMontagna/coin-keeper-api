export class WeeklyRecurringTransactionsError extends Error {
  constructor() {
    super(
      'Error trying to create weekly recurring transactions with less than 2 weeks',
    )
  }
}
