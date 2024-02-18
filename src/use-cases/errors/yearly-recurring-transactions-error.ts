export class YearlyRecurringTransactionsError extends Error {
  constructor() {
    super(
      'Error trying to create yearly recurring transactions with less than 2 years',
    )
  }
}
