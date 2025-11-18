import { useCallback, useEffect, useState } from 'react'
import type {
  BudgetFormValues,
  ExpenseSummary,
  ExpenseTransaction,
  TransactionFormValues,
  MonthlyBudget,
} from '../types/expenses'

const STORAGE_KEY = 'expenseTrackerData'

interface StorageData {
  summary: ExpenseSummary | null
  transactions: ExpenseTransaction[]
  monthlyBudgets: MonthlyBudget[]
}

const getStoredData = (): StorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        summary: data.summary || null,
        transactions: data.transactions || [],
        monthlyBudgets: data.monthlyBudgets || [],
      }
    }
  } catch (err) {
    console.error('Failed to load from localStorage', err)
  }
  return { summary: null, transactions: [], monthlyBudgets: [] }
}

const setStoredData = (data: StorageData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save to localStorage', err)
  }
}

export const useLocalExpensesData = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([])
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    const data = getStoredData()
    setSummary(data.summary)
    setTransactions(
      data.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
    setMonthlyBudgets(data.monthlyBudgets)
    setLoading(false)
  }, [])

  const saveSummary = useCallback(async (values: BudgetFormValues) => {
    const data = getStoredData()
    data.summary = values
    setStoredData(data)
    setSummary(values)
  }, [])

  const saveMonthlyBudget = useCallback(async (monthKey: string, budget: number, income: number) => {
    const data = getStoredData()
    const existingIndex = data.monthlyBudgets.findIndex(mb => mb.month === monthKey)
    
    const monthlyBudget: MonthlyBudget = {
      month: monthKey,
      budget,
      income,
      targetBudget: budget, // Alias
      totalIncome: income, // Alias
    }
    
    if (existingIndex >= 0) {
      data.monthlyBudgets[existingIndex] = monthlyBudget
    } else {
      data.monthlyBudgets.push(monthlyBudget)
    }
    
    setStoredData(data)
    setMonthlyBudgets([...data.monthlyBudgets])
  }, [])

  const getMonthlyBudget = useCallback((monthKey: string): MonthlyBudget | null => {
    const data = getStoredData()
    return data.monthlyBudgets.find(mb => mb.month === monthKey) || null
  }, [])

  const addTransaction = useCallback(async (values: TransactionFormValues) => {
    const data = getStoredData()
    const txnId = `transaction_${Date.now()}`
    const normalized: ExpenseTransaction = {
      id: txnId,
      type: values.type,
      amount: Number(values.amount),
      tag: values.tag,
      date: new Date(values.date).toISOString(),
      description: values.description?.trim() || '',
    }
    data.transactions.push(normalized)
    data.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setStoredData(data)
    setTransactions([...data.transactions])
  }, [])

  const deleteTransaction = useCallback(async (transactionId: string) => {
    const data = getStoredData()
    data.transactions = data.transactions.filter((t) => t.id !== transactionId)
    setStoredData(data)
    setTransactions([...data.transactions])
  }, [])

  return { 
    summary, 
    transactions, 
    monthlyBudgets,
    loading, 
    error, 
    saveSummary, 
    saveMonthlyBudget,
    getMonthlyBudget,
    addTransaction, 
    deleteTransaction 
  }
}
