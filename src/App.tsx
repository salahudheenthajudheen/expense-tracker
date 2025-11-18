import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { BudgetSetupCard } from './components/BudgetSetupCard'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { LoadingState } from './components/LoadingState'
import { SummaryCards } from './components/SummaryCards'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useAuthUser } from './hooks/useAuthUser'
import { useExpensesData } from './hooks/useExpensesData'
import { useLocalExpensesData } from './hooks/useLocalExpensesData'
import { calculateBreakdown, calculateSpent, calculateIncome } from './utils/format'

const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

function App() {
  const { user, loading: authLoading, error: authError } = useAuthUser()

  const firebaseData = useExpensesData(USE_LOCAL_STORAGE ? null : user?.uid)
  const localData = useLocalExpensesData()

  const {
    summary,
    transactions,
    loading: dataLoading,
    error: dataError,
    saveSummary,
    addTransaction,
    deleteTransaction,
  } = USE_LOCAL_STORAGE ? localData : firebaseData

  const [isEditingBudget, setIsEditingBudget] = useState(false)

  const totalSpent = useMemo(() => calculateSpent(transactions), [transactions])
  const totalIncome = useMemo(() => calculateIncome(transactions), [transactions])
  const breakdown = useMemo(() => calculateBreakdown(transactions), [transactions])

  if (authLoading || (user && dataLoading)) {
    return <LoadingState />
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-et-background p-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow">
          <p className="text-lg font-semibold text-rose-600">Authentication failed.</p>
          <p className="text-sm text-slate-500">{authError}</p>
        </div>
      </div>
    )
  }

  const shouldShowSetup = !summary

  return (
    <div className="min-h-screen bg-et-background">
      <header className="sticky top-0 z-10 bg-et-background/95 backdrop-blur-sm border-b border-slate-200 px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500 sm:text-sm">ExpenseTrackerINR</p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl mt-1">Stay on budget</h1>
          <p className="text-sm text-slate-500 sm:text-base mt-1">Track expenses in Indian rupees</p>
        </div>
      </header>

      {dataError && (
        <div className="mx-auto mt-6 flex max-w-5xl items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <AlertTriangle className="h-4 w-4" />
          {dataError}
        </div>
      )}

      {shouldShowSetup ? (
        <div className="mx-auto flex max-w-3xl justify-center p-4">
          <BudgetSetupCard onSubmit={saveSummary} />
        </div>
      ) : (
        <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4 pb-24 sm:gap-6">
          {summary && (
            <SummaryCards summary={summary} spent={totalSpent} income={totalIncome} onEditBudget={() => setIsEditingBudget(true)} />
          )}

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <TransactionForm onSubmit={addTransaction} />
            <CategoryBreakdown data={breakdown} total={totalSpent} />
          </div>

          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </main>
      )}

      {isEditingBudget && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <BudgetSetupCard
            initialValues={summary}
            onSubmit={saveSummary}
            onClose={() => setIsEditingBudget(false)}
            heading="Update your monthly plan"
            helperText="Tweak the budget or income whenever things change."
          />
        </div>
      )}
    </div>
  )
}

export default App
