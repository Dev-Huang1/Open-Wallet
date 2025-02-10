"use client"

const isClient = typeof window !== "undefined"

import { useState, useEffect } from "react"

export interface Transaction {
  id: string
  name: string
  amount: number
  type: "income" | "expense"
  date: string
  description?: string
  category?: string
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
  const [achievements, setAchievements] = useState<string[]>(() => {
    if (isClient) {
      const storedAchievements = localStorage.getItem("achievements")
      return storedAchievements ? JSON.parse(storedAchievements) : []
    }
    return []
  })

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("balance", balance.toString())
      localStorage.setItem("currency", currency)
      localStorage.setItem("transactions", JSON.stringify(transactions))
      localStorage.setItem("achievements", JSON.stringify(achievements))
    }
  }, [balance, currency, transactions, achievements])

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
    checkAchievements([...transactions, newTransaction])
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
    checkAchievements([...transactions.filter((t) => t.id !== updatedTransaction.id), updatedTransaction])
  }

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find((t) => t.id === id)
    if (!transactionToDelete) return

    setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id))
    setBalance((prev) =>
      transactionToDelete.type === "income" ? prev - transactionToDelete.amount : prev + transactionToDelete.amount,
    )
    checkAchievements(transactions.filter((t) => t.id !== id))
  }

  const importData = (data: {
    balance: number
    currency: string
    transactions: Transaction[]
    achievements: string[]
  }) => {
    setBalance(data.balance)
    setCurrency(data.currency)
    setTransactions(data.transactions)
    setAchievements(data.achievements)
  }

  const checkAchievements = (currentTransactions: Transaction[]) => {
    const newAchievements = [...achievements]
    let achievementsUnlocked = false

    // Check for first transaction achievement
    if (currentTransactions.length > 0 && !newAchievements.includes("first_transaction")) {
      newAchievements.push("first_transaction")
      achievementsUnlocked = true
    }

    // Check for transaction streak achievement
    const sortedTransactions = currentTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    let streak = 1
    let currentDate = new Date(sortedTransactions[0].date)
    for (let i = 1; i < sortedTransactions.length; i++) {
      const prevDate = new Date(sortedTransactions[i].date)
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24))
      if (diffDays === 1) {
        streak++
        if (streak === 7 && !newAchievements.includes("transaction_streak")) {
          newAchievements.push("transaction_streak")
          achievementsUnlocked = true
          break
        }
      } else if (diffDays > 1) {
        break
      }
      currentDate = prevDate
    }

    // Check for savings milestone achievement
    if (balance >= 10000 && !newAchievements.includes("savings_milestone")) {
      newAchievements.push("savings_milestone")
      achievementsUnlocked = true
    }

    // Check for diverse portfolio achievement
    const categories = new Set(currentTransactions.map((t) => t.category))
    if (categories.size >= 5 && !newAchievements.includes("diverse_portfolio")) {
      newAchievements.push("diverse_portfolio")
      achievementsUnlocked = true
    }

    // Check for big spender achievement
    const bigTransaction = currentTransactions.find((t) => t.amount >= 1000)
    if (bigTransaction && !newAchievements.includes("big_spender")) {
      newAchievements.push("big_spender")
      achievementsUnlocked = true
    }

    if (newAchievements.length !== achievements.length) {
      setAchievements(newAchievements)
      if (achievementsUnlocked) {
        // Trigger achievement celebration
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("achievementUnlocked"))
        }
      }
    }
  }

  return {
    balance,
    currency,
    transactions,
    achievements,
    setInitialBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importData,
  }
}
