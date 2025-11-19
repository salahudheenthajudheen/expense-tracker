import { useState, useMemo } from 'react'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { MonthSelector } from '../components/MonthSelector'
import { useLocalExpensesData } from '../hooks/useLocalExpensesData'
import { MobileFAB } from '../components/MobileFAB'
import { BottomSheet } from '../components/BottomSheet'
import { getMonthKey, filterTransactionsByMonth } from '../utils/format'

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

            <MobileFAB onClick={() => setIsFormOpen(true)} />

            <BottomSheet
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Add Transaction"
            >
                <TransactionForm onSubmit={async (data) => {
                    await addTransaction(data)
                    setIsFormOpen(false)
                }} />
            </BottomSheet>
        </div>
    )
}
