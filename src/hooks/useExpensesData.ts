import { useCallback, useEffect, useState } from 'react'
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import type {
  BudgetFormValues,
  ExpenseSummary,
  ExpenseTransaction,
  TransactionFormValues,
  TransactionPayload,
} from '../types/expenses'
import { expensesCollectionRef, summaryDocRef } from '../firebase'

export const useExpensesData = (userId?: string | null) => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)

    const unsubscribe = onSnapshot(
      expensesCollectionRef(userId),
      (snapshot) => {
        const nextTransactions: ExpenseTransaction[] = []
        let summaryDoc: ExpenseSummary | null = null

        snapshot.forEach((docSnap) => {
          if (docSnap.id === 'summary') {
            summaryDoc = docSnap.data() as ExpenseSummary
          } else if (docSnap.id.startsWith('transaction_')) {
            const data = docSnap.data() as TransactionPayload
            nextTransactions.push({ id: docSnap.id, ...data })
          }
        })

        nextTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )

        setSummary(summaryDoc)
        setTransactions(nextTransactions)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore listener error', err)
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [userId])

  const saveSummary = useCallback(
    async (values: BudgetFormValues) => {
      if (!userId) throw new Error('User missing for budget setup')
      await setDoc(summaryDocRef(userId), values, { merge: true })
    },
    [userId],
  )

  const addTransaction = useCallback(
    async (values: TransactionFormValues) => {
      if (!userId) throw new Error('User missing for transaction add')
      const txnId = `transaction_${Date.now()}`
      const txnDoc = doc(expensesCollectionRef(userId), txnId)
      const normalized: TransactionPayload = {
        type: values.type,
        amount: Number(values.amount),
        tag: values.tag,
        date: new Date(values.date).toISOString(),
        description: values.description?.trim() || '',
      }
      await setDoc(txnDoc, normalized)
    },
    [userId],
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      if (!userId) throw new Error('User missing for transaction delete')
      if (!transactionId.startsWith('transaction_')) return
      await deleteDoc(doc(expensesCollectionRef(userId), transactionId))
    },
    [userId],
  )

  return { summary, transactions, loading, error, saveSummary, addTransaction, deleteTransaction }
}
