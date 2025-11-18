import { useCallback, useEffect, useState } from 'react'
import type {
  BudgetFormValues,
  ExpenseSummary,
  ExpenseTransaction,
  TransactionFormValues,
} from '../types/expenses'

const STORAGE_KEY = 'expenseTrackerData'

interface StorageData {
  summary: ExpenseSummary | null
  transactions: ExpenseTransaction[]
}

const getStoredData = (): StorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error('Failed to load from localStorage', err)
  }
  return { summary: null, transactions: [] }
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
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    const data = getStoredData()
    setSummary(data.summary)
    setTransactions(
      data.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
    setLoading(false)
  }, [])

  const saveSummary = useCallback(async (values: BudgetFormValues) => {
    const data = getStoredData()
    data.summary = values
    setStoredData(data)
    setSummary(values)
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

  return { summary, transactions, loading, error, saveSummary, addTransaction, deleteTransaction }
}
