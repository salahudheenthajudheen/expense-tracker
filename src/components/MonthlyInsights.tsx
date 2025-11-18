import { TrendingDown, TrendingUp, Calendar, Wallet, DollarSign, PiggyBank } from 'lucide-react'
import { formatCurrency } from '../utils/format'

export interface MonthlyStats {
  month: string
  year: number
  budget: number
  income: number
  expenses: number
  balance: number
  transactionCount: number
  avgDailyExpense: number
}

interface MonthlyInsightsProps {
  currentStats: MonthlyStats
  previousStats: MonthlyStats | null
}

export const MonthlyInsights = ({ currentStats, previousStats }: MonthlyInsightsProps) => {
  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const expenseChange = previousStats ? calculateChange(currentStats.expenses, previousStats.expenses) : null
  const incomeChange = previousStats ? calculateChange(currentStats.income, previousStats.income) : null
  const balanceChange = previousStats ? calculateChange(currentStats.balance, previousStats.balance) : null

  const savingsRate = currentStats.income > 0 
    ? ((currentStats.income - currentStats.expenses) / currentStats.income) * 100 
    : 0

  const budgetUtilization = currentStats.budget > 0
    ? (currentStats.expenses / currentStats.budget) * 100
    : 0

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Monthly Performance</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Balance */}
          <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Balance</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{formatCurrency(currentStats.balance)}</p>
            {balanceChange !== null && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${balanceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {balanceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(balanceChange).toFixed(1)}% vs last month</span>
              </div>
            )}
          </div>

          {/* Savings Rate */}
          <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <PiggyBank className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Savings Rate</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{savingsRate.toFixed(1)}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">of income saved</p>
          </div>

          {/* Budget Usage */}
          <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Budget Used</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{budgetUtilization.toFixed(1)}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(currentStats.budget - currentStats.expenses)} left</p>
          </div>

          {/* Avg Daily Expense */}
          <div className="rounded-lg bg-white/80 dark:bg-slate-800/80 p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Daily Avg</p>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{formatCurrency(currentStats.avgDailyExpense)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentStats.transactionCount} transactions</p>
          </div>
        </div>
      </div>

      {/* Month Comparison */}
      {previousStats && (
        <div className="rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm sm:p-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 sm:text-base">vs Previous Month</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Income</p>
              <div className="flex items-baseline justify-between">
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formatCurrency(currentStats.income)}</p>
                {incomeChange !== null && (
                  <span className={`text-xs font-medium ${incomeChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Previous: {formatCurrency(previousStats.income)}</p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Expenses</p>
              <div className="flex items-baseline justify-between">
                <p className="text-base font-semibold text-slate-900 dark:text-white">{formatCurrency(currentStats.expenses)}</p>
                {expenseChange !== null && (
                  <span className={`text-xs font-medium ${expenseChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Previous: {formatCurrency(previousStats.expenses)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
