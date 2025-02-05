"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { PlusIcon, BarChartIcon, CreditCard } from "lucide-react"
import Link from "next/link"
import { currencySymbols, currencyOptions } from "../utils/currencies"
import { Badge } from "@/components/ui/badge"

interface BalanceDisplayProps {
  balance: number
  currency: string
  onUpdateBalance: (newBalance: number, newCurrency: string) => void
  onAddTransaction: () => void
  recentChange?: {
    amount: number
    type: "increase" | "decrease"
  }
  savingsGoal: number | null
  budget: { amount: number; period: string } | null
}

export default function BalanceDisplay({
  balance,
  currency,
  onUpdateBalance,
  onAddTransaction,
  recentChange,
  savingsGoal,
  budget,
}: BalanceDisplayProps) {
  const { language } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBalance, setNewBalance] = useState(balance.toString())
  const [newCurrency, setNewCurrency] = useState(currency)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateBalance(Number(newBalance), newCurrency)
    setIsDialogOpen(false)
  }

  const currencySymbol = currencySymbols[currency] || currency

  const getPeriodName = (period: string) => {
    switch (period) {
      case "daily":
        return language === "en" ? "Daily" : "每日"
      case "weekly":
        return language === "en" ? "Weekly" : "每周"
      case "monthly":
        return language === "en" ? "Monthly" : "每月"
      default:
        return period
    }
  }

  return (
    <>
      <div className="glassmorphism rounded-3xl overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white opacity-80">
                {language === "en" ? "Current Balance" : "当前余额"}
              </h2>
              <motion.div
                className="text-5xl font-bold text-white mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setIsDialogOpen(true)}
              >
                {currencySymbol}
                {balance.toFixed(2)}
              </motion.div>
            </div>
            <CreditCard className="h-8 w-8 text-white opacity-50" />
          </div>

          {recentChange && (
            <motion.div
              className={`text-sm ${recentChange.type === "increase" ? "text-green-300" : "text-red-300"}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {recentChange.type === "increase" ? "+" : "-"}
              {currencySymbol}
              {recentChange.amount.toFixed(2)}
            </motion.div>
          )}

          <div className="flex space-x-2 mt-4">
            {savingsGoal && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                <span className="font-medium">{language === "en" ? "Goal: " : "目标: "}</span>
                {currencySymbol}
                {savingsGoal.toFixed(2)}
              </Badge>
            )}

            {budget && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                <span className="font-medium">
                  {language === "en"
                    ? `${getPeriodName(budget.period)} Budget: `
                    : `${getPeriodName(budget.period)}预算: `}
                </span>
                {currencySymbol}
                {budget.amount.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex space-x-4">
            <Button
              onClick={onAddTransaction}
              variant="outline"
              className="flex-1 rounded-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800 dark:hover:bg-blue-800"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {language === "en" ? "Add" : "添加"}
            </Button>
            <Link href="/analytics" className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-full bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800 dark:hover:bg-purple-800"
              >
                <BarChartIcon className="mr-2 h-4 w-4" />
                {language === "en" ? "Analytics" : "分析"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Update Balance" : "更新余额"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder={language === "en" ? "Enter new balance" : "输入新余额"}
              className="rounded-xl"
              required
            />
            <Select value={newCurrency} onValueChange={setNewCurrency}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={language === "en" ? "Select currency" : "选择货币"} />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.symbol} - {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-full">
              {language === "en" ? "Update" : "更新"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
