"use client"

import { useState, useEffect } from "react"
import BalanceSetup from "./components/BalanceSetup"
import TransactionList from "./components/TransactionList"
import AddTransactionDialog from "./components/AddTransactionDialog"
import { useTransactions } from "./hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { PlusIcon, BarChartIcon } from "lucide-react"
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext"
import BalanceDisplay from "./components/BalanceDisplay"
import Link from "next/link"
import MenuBar from "./components/MenuBar"

function Home() {
  const { balance, currency, transactions, addTransaction, updateTransaction, deleteTransaction, setInitialBalance } =
    useTransactions()
  const { language } = useLanguage()
  const [isBalanceSet, setIsBalanceSet] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  useEffect(() => {
    if (balance > 0 || transactions.length > 0) {
      setIsBalanceSet(true)
    }
  }, [balance, transactions])

  const handleSetBalance = (amount: number, selectedCurrency: string) => {
    setInitialBalance(amount, selectedCurrency)
    setIsBalanceSet(true)
  }

  const updateBalance = (newBalance: number) => {
    setInitialBalance(newBalance, currency)
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <MenuBar />
      {!isBalanceSet ? (
        <BalanceSetup onSetBalance={handleSetBalance} />
      ) : (
        <div className="space-y-6">
          <BalanceDisplay balance={balance} currency={currency} onUpdateBalance={updateBalance} />
          <div className="flex space-x-4">
            <Button onClick={() => setIsAddTransactionOpen(true)} className="flex-1">
              <PlusIcon className="mr-2 h-4 w-4" />
              {language === "en" ? "Add Transaction" : "添加交易"}
            </Button>
            <Link href="/analytics" className="flex-1">
              <Button className="w-full">
                <BarChartIcon className="mr-2 h-4 w-4" />
                {language === "en" ? "View Analytics" : "查看分析"}
              </Button>
            </Link>
          </div>
          <TransactionList
            transactions={sortedTransactions}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
          <AddTransactionDialog
            isOpen={isAddTransactionOpen}
            onClose={() => setIsAddTransactionOpen(false)}
            onAddTransaction={addTransaction}
          />
        </div>
      )}
    </main>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  )
}
