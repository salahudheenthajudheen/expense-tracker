import { useState, useMemo } from 'react'
import { MonthSelector } from '../components/MonthSelector'
import { MonthlyInsights } from '../components/MonthlyInsights'
import { SummaryCards } from '../components/SummaryCards'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { BudgetSetupCard } from '../components/BudgetSetupCard'
import { LoadingState } from '../components/LoadingState'
import { useLocalExpensesData } from '../hooks/useLocalExpensesData'
import {
    calculateBreakdown,
    calculateSpent,
    calculateIncome,
    getMonthKey,
    filterTransactionsByMonth,
    calculateMonthlyStats
} from '../utils/format'

export function Dashboard() {
    const {
        summary,
        transactions,
        getMonthlyBudget,
        saveMonthlyBudget,
        saveSummary,
        loading,
        error,
    } = useLocalExpensesData()

    const [isEditingBudget, setIsEditingBudget] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date())

    const currentMonthKey = useMemo(() => getMonthKey(selectedMonth), [selectedMonth])
    const monthTransactions = useMemo(
        () => filterTransactionsByMonth(transactions, currentMonthKey),
        [transactions, currentMonthKey]
    )

    const monthlyBudget = useMemo(() => {
        const stored = getMonthlyBudget(currentMonthKey)
        return stored || summary
    }, [currentMonthKey, getMonthlyBudget, summary])

    const totalSpent = useMemo(() => calculateSpent(monthTransactions), [monthTransactions])
    const totalIncome = useMemo(() => calculateIncome(monthTransactions), [monthTransactions])
    const breakdown = useMemo(() => calculateBreakdown(monthTransactions), [monthTransactions])

    const currentStats = useMemo(() => {
        return calculateMonthlyStats(
            transactions,
            currentMonthKey,
            monthlyBudget?.targetBudget || 0,
            monthlyBudget?.totalIncome || 0
        )
    }, [transactions, currentMonthKey, monthlyBudget])

    const previousMonthKey = useMemo(() => {
        const prevDate = new Date(selectedMonth)
        prevDate.setMonth(prevDate.getMonth() - 1)
        return getMonthKey(prevDate)
    }, [selectedMonth])

    const previousStats = useMemo(() => {
        const prevBudget = getMonthlyBudget(previousMonthKey)
        if (!prevBudget && !summary) return null

        return calculateMonthlyStats(
            transactions,
            previousMonthKey,
            prevBudget?.targetBudget || summary?.targetBudget || 0,
            prevBudget?.totalIncome || summary?.totalIncome || 0
        )
    }, [transactions, previousMonthKey, getMonthlyBudget, summary])

    const handleBudgetUpdate = async (values: { targetBudget: number; totalIncome: number }) => {
        await saveMonthlyBudget(currentMonthKey, values.targetBudget, values.totalIncome)
        await saveSummary(values)
        setIsEditingBudget(false)
    }

    if (loading) return <LoadingState />

    if (error) {
        return (
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 text-center shadow">
                <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">Error loading data.</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            </div>
        )
    }

    const shouldShowSetup = !summary || summary.targetBudget === 0

    if (shouldShowSetup) {
        return (
            <div className="mx-auto flex max-w-3xl justify-center p-4">
                <BudgetSetupCard onSubmit={handleBudgetUpdate} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>

            <MonthlyInsights currentStats={currentStats} previousStats={previousStats} />

            {monthlyBudget && (
                <SummaryCards
                    summary={monthlyBudget}
                    spent={totalSpent}
                    income={totalIncome}
                    onEditBudget={() => setIsEditingBudget(true)}
                />
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <CategoryBreakdown data={breakdown} total={totalSpent} />
                {/* Placeholder for Recent Transactions or other widgets */}
            </div>

            {isEditingBudget && monthlyBudget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                    <BudgetSetupCard
                        initialValues={monthlyBudget}
                        onSubmit={handleBudgetUpdate}
                        onClose={() => setIsEditingBudget(false)}
                        heading="Update this month's budget"
                        helperText="Set budget and income for the selected month."
                    />
                </div>
            )}
        </div>
    )
}
