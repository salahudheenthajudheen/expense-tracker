import { useState, useMemo } from 'react'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { MonthSelector } from '../components/MonthSelector'
import { useLocalExpensesData } from '../hooks/useLocalExpensesData'
import { getMonthKey, filterTransactionsByMonth } from '../utils/format'
import { Plus } from 'lucide-react'

export function Transactions() {
    const { transactions, addTransaction, deleteTransaction } = useLocalExpensesData()
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [isFormOpen, setIsFormOpen] = useState(false)

    const currentMonthKey = useMemo(() => getMonthKey(selectedMonth), [selectedMonth])
    const monthTransactions = useMemo(
        () => filterTransactionsByMonth(transactions, currentMonthKey),
        [transactions, currentMonthKey]
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h2>
                <div className="flex items-center gap-2">
                    <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 sm:hidden"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="hidden sm:block">
                    <TransactionForm onSubmit={addTransaction} />
                </div>

                <div className="space-y-4">
                    <TransactionList transactions={monthTransactions} onDelete={deleteTransaction} />
                </div>
            </div>

            {/* Mobile Transaction Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 sm:p-4">
                    <div className="w-full sm:max-w-lg bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Transaction</h3>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Close
                            </button>
                        </div>
                        <TransactionForm onSubmit={async (data) => {
                            await addTransaction(data)
                            setIsFormOpen(false)
                        }} />
                    </div>
                </div>
            )}
        </div>
    )
}
