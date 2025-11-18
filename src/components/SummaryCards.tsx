import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from 'lucide-react'
import type { ExpenseSummary } from '../types/expenses'
import { formatCurrency, getProgressColor } from '../utils/format'

interface SummaryCardsProps {
  summary: ExpenseSummary | null
  spent: number
  income: number
  onEditBudget: () => void
}

export const SummaryCards = ({ summary, spent, income, onEditBudget }: SummaryCardsProps) => {
  const budget = summary?.targetBudget ?? 0
  const savingsPotential = Math.max(income - spent, 0)
  const progressPercent = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const progressBarColor = getProgressColor(summary, spent)

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <article className="col-span-2 rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-500 sm:text-sm">Budget vs spent</p>
          <Wallet className="h-4 w-4 text-indigo-500 sm:h-5 sm:w-5" />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2 sm:mt-4">
          <span className="text-2xl font-semibold text-slate-900 sm:text-3xl">{formatCurrency(spent)}</span>
          <span className="text-sm text-slate-500 sm:text-base">/ {formatCurrency(budget)}</span>
        </div>
        <div className="mt-3 h-2.5 w-full rounded-full bg-slate-100 sm:mt-4 sm:h-3">
          <div className={`h-full rounded-full ${progressBarColor}`} style={{ width: `${progressPercent}%` }} />
        </div>
        <button
          type="button"
          onClick={onEditBudget}
          className="mt-2.5 text-xs font-medium text-indigo-600 hover:text-indigo-500 sm:mt-3 sm:text-sm"
        >
          Edit budget
        </button>
      </article>

      <article className="rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-500 sm:text-sm">Income</p>
          <ArrowUpCircle className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
        </div>
        <p className="mt-3 text-xl font-semibold text-emerald-600 sm:mt-4 sm:text-3xl">{formatCurrency(income)}</p>
        <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">This month</p>
      </article>

      <article className="rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-500 sm:text-sm">Expenses</p>
          <ArrowDownCircle className="h-4 w-4 text-rose-500 sm:h-5 sm:w-5" />
        </div>
        <p className="mt-3 text-xl font-semibold text-rose-600 sm:mt-4 sm:text-3xl">{formatCurrency(spent)}</p>
        <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">{progressPercent}% used</p>
      </article>

      <article className="col-span-2 rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:col-span-1 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-500 sm:text-sm">Balance</p>
          <PiggyBank className="h-4 w-4 text-indigo-500 sm:h-5 sm:w-5" />
        </div>
        <p className="mt-3 text-xl font-semibold text-slate-900 sm:mt-4 sm:text-3xl">{formatCurrency(savingsPotential)}</p>
        <p className="mt-1.5 text-xs text-slate-500 sm:mt-2 sm:text-sm">To save</p>
      </article>
    </section>
  )
}
