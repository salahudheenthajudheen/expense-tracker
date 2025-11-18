export const EXPENSE_TAGS = [
  'Fuel',
  'Snacks',
  'Trip',
  'Travel',
  'Food',
  'Shopping',
  'Bills',
  'Entertainment',
  'Others',
] as const

export type ExpenseTag = (typeof EXPENSE_TAGS)[number]

export type TransactionType = 'income' | 'expense'

export interface ExpenseSummary {
  targetBudget: number
  totalIncome: number
}

export interface ExpenseTransaction {
  id: string
  type: TransactionType
  amount: number
  description?: string
  date: string
  tag: ExpenseTag
}

export interface TransactionPayload extends Omit<ExpenseTransaction, 'id'> {}

export interface CategorySlice {
  tag: ExpenseTag
  amount: number
  percent: number
  [key: string]: string | number
}

export interface BudgetFormValues {
  targetBudget: number
  totalIncome: number
}

export interface TransactionFormValues {
  type: TransactionType
  amount: number
  tag: ExpenseTag
  date: string
  description: string
}

export interface FilterState {
  dateFrom?: string
  dateTo?: string
  category?: ExpenseTag | 'all'
  search?: string
}
