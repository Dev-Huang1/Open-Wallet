"use client"

import { useTransactions } from "../hooks/useTransactions"
import TransactionAnalytics from "../components/TransactionAnalytics"
import TransactionList from "../components/TransactionList"
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MenuBar from "../components/MenuBar"

function AnalyticsPage() {
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()
  const { language } = useLanguage()

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <MenuBar />
      <h1 className="text-3xl font-bold mb-6">{language === "en" ? "Analytics" : "分析"}</h1>
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

export default function AnalyticsPageWrapper() {
  return (
    <LanguageProvider>
      <AnalyticsPage />
    </LanguageProvider>
  )
}
