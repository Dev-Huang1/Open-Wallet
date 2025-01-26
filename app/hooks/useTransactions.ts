const isClient = typeof window !== "undefined"

import { useState, useEffect } from "react"

export interface Transaction {
  id: string
  name: string
  amount: number
  type: "income" | "expense"
  date: string
  description?: string
}

export function useTransactions() {
  const [balance, setBalance] = useState(() => {
    if (isClient) {
      const storedBalance = localStorage.getItem("balance")
      return storedBalance ? Number(storedBalance) : 0
    }
    return 0
  })
  const [currency, setCurrency] = useState(() => {
    if (isClient) {
      return localStorage.getItem("currency") || "CNY"
    }
    return "CNY"
  })
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (isClient) {
      const storedTransactions = localStorage.getItem("transactions")
      return storedTransactions ? JSON.parse(storedTransactions) : []
    }
    return []
  })

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("balance", balance.toString())
      localStorage.setItem("currency", currency)
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [balance, currency, transactions])

  const setInitialBalance = (amount: number, selectedCurrency: string) => {
    setBalance(amount)
    setCurrency(selectedCurrency)
  }

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prevTransactions) => {
      const updatedTransactions = [newTransaction, ...prevTransactions]
      return updatedTransactions
    })
    setBalance((prev) => (transaction.type === "income" ? prev + transaction.amount : prev - transaction.amount))
  }

  const updateTransaction = (updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find((t) => t.id === updatedTransaction.id)
    if (!oldTransaction) return

    const balanceDiff =
      (updatedTransaction.type === "income" ? updatedTransaction.amount : -updatedTransaction.amount) -
      (oldTransaction.type === "income" ? oldTransaction.amount : -oldTransaction.amount)

    setTransactions((prevTransactions) =>
      prevTransactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)),
    )
    setBalance((prev) => prev + balanceDiff)
  }

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find((t) => t.id === id)
    if (!transactionToDelete) return

    setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id))
    setBalance((prev) =>
      transactionToDelete.type === "income" ? prev - transactionToDelete.amount : prev + transactionToDelete.amount,
    )
  }

  const importData = (data: { balance: number; currency: string; transactions: Transaction[] }) => {
    setBalance(data.balance)
    setCurrency(data.currency)
    setTransactions(data.transactions)
  }

  return {
    balance,
    currency,
    transactions,
    setInitialBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importData,
  }
}

