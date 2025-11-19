import { useState, useMemo } from 'react'
import { Plus, Target, Wallet, Trash2, Coins } from 'lucide-react'
import { useLocalExpensesData } from '../hooks/useLocalExpensesData'
import { formatCurrency, calculateIncome, calculateSpent } from '../utils/format'
import { BottomSheet } from '../components/BottomSheet'

export function Savings() {
    const { savingsGoals, transactions, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useLocalExpensesData()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
    const [allocateAmount, setAllocateAmount] = useState('')

    // Form state for new goal
    const [newGoalName, setNewGoalName] = useState('')
    const [newGoalTarget, setNewGoalTarget] = useState('')

    const availableBalance = useMemo(() => {
        const income = calculateIncome(transactions)
        const spent = calculateSpent(transactions)
        return income - spent
    }, [transactions])

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGoalName || !newGoalTarget) return

        await addSavingsGoal({
            name: newGoalName,
            targetAmount: Number(newGoalTarget),
        })

        setNewGoalName('')
        setNewGoalTarget('')
        setIsAddModalOpen(false)
    }

    const handleAllocate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedGoalId || !allocateAmount) return

        await updateSavingsGoal(selectedGoalId, Number(allocateAmount))
        setSelectedGoalId(null)
        setAllocateAmount('')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Savings Goals</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your financial goals</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Goal
                </button>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-full bg-white/20 p-2">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-white/90">Available Balance</h3>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
                <p className="text-sm text-indigo-100 mt-1">Available to allocate towards goals</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savingsGoals.map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)

                    return (
                        <div key={goal.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md border border-slate-100 dark:border-slate-700">
                            <div className="flex items-start justify-between mb-4">
                                <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-3">
                                    <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <button
                                    onClick={() => deleteSavingsGoal(goal.id)}
                                    className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{goal.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(goal.currentAmount)}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    of {formatCurrency(goal.targetAmount)}
                                </span>
                            </div>

                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                                <div
                                    className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500"
                                    style={{ width: `${progress}% ` }}
                                />
                            </div>

                            <button
                                onClick={() => setSelectedGoalId(goal.id)}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Wallet className="h-4 w-4" />
                                Add Funds
                            </button>
                        </div>
                    )
                })}

                {savingsGoals.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
                        <div className="rounded-full bg-slate-50 dark:bg-slate-800 p-4 mb-4">
                            <Target className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No savings goals yet</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a goal to start tracking your savings journey.</p>
                    </div>
                )}
            </div>

            {/* Add Goal Modal */}
            <BottomSheet
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create New Goal"
            >
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                        <input
                            type="text"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="e.g. New Car, Vacation"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Amount</label>
                        <input
                            type="number"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="0.00"
                            min="1"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Create Goal
                        </button>
                    </div>
                </form>
            </BottomSheet>

            {/* Allocate Funds Modal */}
            <BottomSheet
                isOpen={!!selectedGoalId}
                onClose={() => setSelectedGoalId(null)}
                title="Add Funds"
            >
                <form onSubmit={handleAllocate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Add</label>
                        <input
                            type="number"
                            value={allocateAmount}
                            onChange={(e) => setAllocateAmount(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="0.00"
                            min="1"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setSelectedGoalId(null)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Add Funds
                        </button>
                    </div>
                </form>
            </BottomSheet>
        </div>
    )
}
