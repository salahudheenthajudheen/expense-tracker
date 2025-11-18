import { useEffect, useState } from 'react'
import { Loader2, Wallet, X } from 'lucide-react'
import type { BudgetFormValues, ExpenseSummary } from '../types/expenses'
import { formatCurrency } from '../utils/format'

interface BudgetSetupCardProps {
  initialValues?: ExpenseSummary | null
  onSubmit: (values: BudgetFormValues) => Promise<void>
  onClose?: () => void
  heading?: string
  helperText?: string
}

export const BudgetSetupCard = ({
  initialValues,
  onSubmit,
  onClose,
  heading = 'Set up your monthly plan',
  helperText = 'Add your overall budget and monthly income to unlock analytics.',
}: BudgetSetupCardProps) => {
  const [formValues, setFormValues] = useState({
    targetBudget: initialValues?.targetBudget?.toString() ?? '',
    totalIncome: initialValues?.totalIncome?.toString() ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormValues({
      targetBudget: initialValues?.targetBudget?.toString() ?? '',
      totalIncome: initialValues?.totalIncome?.toString() ?? '',
    })
  }, [initialValues])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const targetBudget = Number(formValues.targetBudget)
    const totalIncome = Number(formValues.totalIncome)

    if (!targetBudget || !totalIncome) {
      setError('Please provide both budget and income values greater than zero.')
      return
    }

    try {
      setSaving(true)
      await onSubmit({ targetBudget, totalIncome })
      onClose?.()
    } catch (err) {
      console.error(err)
      setError('Unable to save budget. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-et-card rounded-2xl shadow-lg p-5 w-full max-w-lg sm:p-6">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600 sm:rounded-2xl sm:p-3">
          <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{heading}</h2>
              <p className="text-sm text-slate-500 sm:text-base">{helperText}</p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-slate-600 sm:text-sm">Monthly Budget</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 sm:mt-2 sm:px-4 sm:py-3">
            <span className="text-sm text-slate-400 sm:text-base">₹</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={formValues.targetBudget}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, targetBudget: event.target.value }))
              }
              className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none sm:text-lg"
              placeholder="15,000"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-600 sm:text-sm">Monthly Income</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 sm:mt-2 sm:px-4 sm:py-3">
            <span className="text-sm text-slate-400 sm:text-base">₹</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={formValues.totalIncome}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, totalIncome: event.target.value }))
              }
              className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none sm:text-lg"
              placeholder="25,000"
            />
          </div>
        </label>

        {initialValues && (
          <p className="text-sm text-slate-500">
            Current setup · Budget {formatCurrency(initialValues.targetBudget)} · Income{' '}
            {formatCurrency(initialValues.totalIncome)}
          </p>
        )}

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            'Save Monthly Plan'
          )}
        </button>
      </form>
    </div>
  )
}
