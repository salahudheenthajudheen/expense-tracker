import { useState } from 'react'
import { ArrowUpCircle, Filter, Search, Trash2 } from 'lucide-react'
import type { ExpenseTransaction, FilterState } from '../types/expenses'
import { EXPENSE_TAGS } from '../types/expenses'
import { formatCurrency, formatDate } from '../utils/format'
import { getTagIcon, getTagStyles } from '../utils/tagHelpers'

interface TransactionListProps {
  transactions: ExpenseTransaction[]
  onDelete: (transactionId: string) => Promise<void>
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const [activeDelete, setActiveDelete] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    search: '',
  })

  const deleteHandler = async (id: string) => {
    setActiveDelete(id)
    try {
      await onDelete(id)
    } catch (err) {
      console.error('Failed to delete transaction', err)
    } finally {
      setActiveDelete((current) => (current === id ? null : current))
    }
  }

  const filtered = transactions.filter((txn) => {
    if (filters.category && filters.category !== 'all' && txn.tag !== filters.category) return false
    if (
      filters.search &&
      !txn.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !txn.tag.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    return true
  })

  const recent = filtered.slice(0, 50)

  return (
    <section className="rounded-2xl bg-et-card p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Transaction history</h3>
          <p className="text-xs text-slate-500 sm:text-sm">
            Showing {recent.length} of {transactions.length} items
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 sm:p-2"
        >
          <Filter className="h-4 w-4 sm:h-4 sm:w-4" />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 sm:py-2 sm:pl-10 sm:pr-4"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.category === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {EXPENSE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: tag }))}
                className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition sm:px-3 ${
                  filters.category === tag
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {!recent.length && (
        <p className="mt-6 text-sm text-slate-500">
          {filters.search || filters.category !== 'all'
            ? 'No transactions match your filters.'
            : 'No transactions yet. Add your first one above.'}
        </p>
      )}

      <ul className="mt-4 divide-y divide-slate-100">
        {recent.map((txn) => {
          const Icon = txn.type === 'income' ? ArrowUpCircle : getTagIcon(txn.tag)
          const pillStyles = txn.type === 'income' ? 'bg-emerald-100 text-emerald-700' : getTagStyles(txn.tag)
          const amountColor = txn.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
          const amountPrefix = txn.type === 'income' ? '+' : '-'

          return (
            <li key={txn.id} className="flex items-center gap-2.5 py-3 sm:gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 sm:rounded-2xl ${pillStyles}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {txn.description || (txn.type === 'income' ? 'Income' : txn.tag)}
                </p>
                <p className="text-xs text-slate-500">{formatDate(txn.date)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-sm font-semibold sm:text-base ${amountColor}`}>
                  {amountPrefix}
                  {formatCurrency(txn.amount)}
                </p>
              </div>
              <button
                type="button"
                disabled={activeDelete === txn.id}
                onClick={() => deleteHandler(txn.id)}
                className="shrink-0 rounded-full border border-slate-200 p-2.5 text-slate-400 transition hover:text-rose-500 disabled:cursor-not-allowed sm:p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
