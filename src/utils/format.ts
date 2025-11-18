import type { CategorySlice, ExpenseTransaction, ExpenseSummary } from '../types/expenses'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

export const formatCurrency = (value: number) => currencyFormatter.format(value || 0)

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? 'Invalid date' : dateFormatter.format(date)
}

export const calculateSpent = (transactions: ExpenseTransaction[]) =>
  transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((total, txn) => total + (txn.amount || 0), 0)

export const calculateIncome = (transactions: ExpenseTransaction[]) =>
  transactions
    .filter((txn) => txn.type === 'income')
    .reduce((total, txn) => total + (txn.amount || 0), 0)

export const calculateBreakdown = (transactions: ExpenseTransaction[]): CategorySlice[] => {
  const expenses = transactions.filter((txn) => txn.type === 'expense')
  if (!expenses.length) return []

  const totals = expenses.reduce<Record<string, number>>((acc, txn) => {
    acc[txn.tag] = (acc[txn.tag] || 0) + txn.amount
    return acc
  }, {})

  const grandTotal = calculateSpent(transactions)

  return Object.entries(totals)
    .map(([tag, amount]) => ({
      tag: tag as CategorySlice['tag'],
      amount,
      percent: grandTotal ? Math.round((amount / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export const getProgressColor = (summary: ExpenseSummary | null, spent: number) => {
  if (!summary || !summary.targetBudget) return 'bg-emerald-500'
  const ratio = spent / summary.targetBudget
  if (ratio >= 1) return 'bg-rose-500'
  if (ratio >= 0.75) return 'bg-amber-400'
  return 'bg-emerald-500'
}
