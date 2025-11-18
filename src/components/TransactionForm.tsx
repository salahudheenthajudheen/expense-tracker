import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Loader2, Plus, Tag } from 'lucide-react'
import type { ExpenseTag, TransactionFormValues, TransactionType } from '../types/expenses'
import { EXPENSE_TAGS } from '../types/expenses'
import { getTagIcon, getTagStyles } from '../utils/tagHelpers'

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => Promise<void>
}

const todayDate = () => new Date().toISOString().split('T')[0]

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [formValues, setFormValues] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    tag: 'Food' as ExpenseTag,
    date: todayDate(),
    description: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const amount = Number(formValues.amount)
    if (!amount) {
      setError('Amount must be more than ₹0')
      return
    }

    try {
      setSaving(true)
      await onSubmit({
        type: formValues.type,
        amount,
        tag: formValues.tag,
        date: formValues.date,
        description: formValues.description.trim(),
      })
      setFormValues((prev) => ({ ...prev, amount: '', description: '' }))
    } catch (err) {
      console.error(err)
      setError('Could not add transaction. Please retry.')
    } finally {
      setSaving(false)
    }
  }

  const isIncome = formValues.type === 'income'

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 rounded-2xl bg-et-card dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 sm:space-y-4 sm:p-5">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className={`rounded-xl p-2.5 sm:rounded-2xl sm:p-3 ${isIncome ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'}`}>
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Add transaction</h3>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">Track income or expenses instantly.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormValues((prev) => ({ ...prev, type: 'expense' }))}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:gap-2 sm:px-4 sm:py-3 ${
            formValues.type === 'expense'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <ArrowDownCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Expense
        </button>
        <button
          type="button"
          onClick={() => setFormValues((prev) => ({ ...prev, type: 'income' }))}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:gap-2 sm:px-4 sm:py-3 ${
            formValues.type === 'income'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <ArrowUpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Income
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <label className="flex flex-col gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">Amount (₹)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={formValues.amount}
            onChange={(event) => setFormValues((prev) => ({ ...prev, amount: event.target.value }))}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2.5 text-base font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-400 sm:px-4 sm:py-3 sm:text-lg"
            placeholder="1,500"
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">Date</span>
          <input
            type="date"
            value={formValues.date}
            onChange={(event) => setFormValues((prev) => ({ ...prev, date: event.target.value }))}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-400 sm:px-4 sm:py-3 sm:text-base"
            max={todayDate()}
          />
        </label>
      </div>

      {!isIncome && (
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">Category</p>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            {EXPENSE_TAGS.map((tag) => {
              const Icon = getTagIcon(tag)
              const styles = getTagStyles(tag)
              const isSelected = formValues.tag === tag
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setFormValues((prev) => ({ ...prev, tag }))}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition sm:gap-2 sm:px-3 sm:text-sm ${
                    isSelected ? styles : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1.5 sm:gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">Note (optional)</span>
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-2.5 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 sm:rounded-2xl sm:px-4 sm:py-3">
          <Tag className="mt-0.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 sm:mt-1 sm:h-4 sm:w-4" />
          <textarea
            rows={2}
            value={formValues.description}
            onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
            placeholder={isIncome ? 'Salary, freelance, etc.' : 'Fuel top-up, movie ticket, groceries, etc.'}
            className="w-full resize-none bg-transparent text-xs text-slate-900 dark:text-white outline-none sm:text-sm"
          />
        </div>
      </label>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-2xl sm:text-base ${
          isIncome ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
        }`}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving
          </>
        ) : (
          `Add ${isIncome ? 'income' : 'expense'}`
        )}
      </button>
    </form>
  )
}
