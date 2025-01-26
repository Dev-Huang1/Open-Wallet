"use client"

import { useTransactions } from "../hooks/useTransactions"
import TransactionAnalytics from "../components/TransactionAnalytics"
import TransactionList from "../components/TransactionList"
import { useLanguage } from "../contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MenuBar from "../components/MenuBar"

export default function AnalyticsPage() {
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()
  const { language } = useLanguage()

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">
        {language === "en" ? "Open Wallet Analytics" : "Open Wallet 分析"}
      </h1>
      <MenuBar />
      <Link href="/">
        <Button className="mb-6">{language === "en" ? "Back to Home" : "返回首页"}</Button>
      </Link>
      <div className="space-y-8">
        <TransactionAnalytics transactions={sortedTransactions} />
        <TransactionList
          transactions={sortedTransactions}
          onUpdateTransaction={updateTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  )
}

