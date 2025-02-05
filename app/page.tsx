"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import BalanceSetup from "./components/BalanceSetup"
import TransactionList from "./components/TransactionList"
import AddTransactionDialog from "./components/AddTransactionDialog"
import { useTransactions, type Transaction } from "./hooks/useTransactions"
import { useLanguage, LanguageProvider } from "./contexts/LanguageContext"
import BalanceDisplay from "./components/BalanceDisplay"
import MenuBar from "./components/MenuBar"
import { Card, CardContent } from "@/components/ui/card"
import { SuggestedForYou } from "./components/SuggestedForYou"
import { ExchangeRate } from "./components/ExchangeRate"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function Home() {
  const { balance, currency, transactions, addTransaction, updateTransaction, deleteTransaction, setInitialBalance } =
    useTransactions()
  const { language } = useLanguage()
  const { toast } = useToast()
  const [isBalanceSet, setIsBalanceSet] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [recentChange, setRecentChange] = useState<{ amount: number; type: "increase" | "decrease" } | undefined>()
  const [savingsGoal, setSavingsGoal] = useState<number | null>(null)
  const [budget, setBudget] = useState<{ amount: number; period: string } | null>(null)
  const [isSavingsGoalDialogOpen, setIsSavingsGoalDialogOpen] = useState(false)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [goalAmount, setGoalAmount] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState<"daily" | "weekly" | "monthly">("monthly")

  useEffect(() => {
    if (balance > 0 || transactions.length > 0) {
      setIsBalanceSet(true)
    }
  }, [balance, transactions])

  useEffect(() => {
    if (savingsGoal && balance >= savingsGoal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      toast({
        title: language === "en" ? "Congratulations!" : "恭喜！",
        description: language === "en" ? "You've reached your savings goal!" : "您已达到储蓄目标！",
      })
    }
  }, [balance, savingsGoal, language, toast])

  useEffect(() => {
    if (budget) {
      const now = new Date()
      const expenses = transactions.filter(
        (t) => t.type === "expense" && isWithinPeriod(new Date(t.date), now, budget.period),
      )
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)

      if (totalExpense > budget.amount) {
        toast({
          title: language === "en" ? "Budget Alert" : "预算提醒",
          description:
            language === "en"
              ? `You've exceeded your ${getPeriodName(budget.period)} budget of ${currency}${budget.amount.toFixed(2)}`
              : `您已超出${getPeriodName(budget.period)}预算${currency}${budget.amount.toFixed(2)}`,
          variant: "destructive",
        })
      }
    }
  }, [transactions, budget, currency, language, toast])

  const handleSetBalance = (amount: number, selectedCurrency: string) => {
    setInitialBalance(amount, selectedCurrency)
    setIsBalanceSet(true)
  }

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    addTransaction(transaction)
    setRecentChange({
      amount: transaction.amount,
      type: transaction.type === "income" ? "increase" : "decrease",
    })
  }

  const updateBalance = (newBalance: number, newCurrency: string) => {
    setInitialBalance(newBalance, newCurrency)
  }

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault()
    const goal = Number(goalAmount)
    if (goal > balance) {
      setSavingsGoal(goal)
      setIsSavingsGoalDialogOpen(false)
      setGoalAmount("")
    }
  }

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault()
    const newBudget = { amount: Number(budgetAmount), period: budgetPeriod }
    setBudget(newBudget)
    setIsBudgetDialogOpen(false)
    setBudgetAmount("")
  }

  const isWithinPeriod = (date: Date, now: Date, period: string) => {
    switch (period) {
      case "daily":
        return date.toDateString() === now.toDateString()
      case "weekly":
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        return date >= weekStart
      case "monthly":
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      default:
        return false
    }
  }

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

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Open Wallet</h1>
          <MenuBar />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder={language === "en" ? "Search transactions..." : "搜索交易..."}
            className="pl-10 rounded-2xl h-12"
          />
        </div>

        {!isBalanceSet ? (
          <Card className="glassmorphism w-full rounded-3xl overflow-hidden">
            <CardContent className="pt-6">
              <BalanceSetup onSetBalance={handleSetBalance} />
            </CardContent>
          </Card>
        ) : (
          <>
            <BalanceDisplay
              balance={balance}
              currency={currency}
              onUpdateBalance={updateBalance}
              onAddTransaction={() => setIsAddTransactionOpen(true)}
              recentChange={recentChange}
              savingsGoal={savingsGoal}
              budget={budget}
            />

            <SuggestedForYou
              onOpenSavingsGoal={() => setIsSavingsGoalDialogOpen(true)}
              onOpenBudgetSetting={() => setIsBudgetDialogOpen(true)}
            />

            <ExchangeRate baseCurrency={currency} />

            <Card className="rounded-3xl overflow-hidden bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <TransactionList
                  transactions={sortedTransactions}
                  onUpdateTransaction={updateTransaction}
                  onDeleteTransaction={deleteTransaction}
                  categories={[]}
                  currency={currency}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <Dialog open={isSavingsGoalDialogOpen} onOpenChange={setIsSavingsGoalDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Set Savings Goal" : "设置储蓄目标"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSetGoal} className="space-y-4">
            <Input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder={language === "en" ? "Enter goal amount" : "输入目标金额"}
              className="rounded-xl"
              required
              min={balance + 0.01}
              step="0.01"
            />
            <Button type="submit" className="w-full rounded-full">
              {language === "en" ? "Set Goal" : "设置目标"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Set Budget" : "设置预算"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <Input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder={language === "en" ? "Enter budget amount" : "输入预算金额"}
              className="rounded-xl"
              required
              min="0.01"
              step="0.01"
            />
            <Select
              value={budgetPeriod}
              onValueChange={(value: "daily" | "weekly" | "monthly") => setBudgetPeriod(value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={language === "en" ? "Select budget period" : "选择预算周期"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === "en" ? "Daily" : "每日"}</SelectItem>
                <SelectItem value="weekly">{language === "en" ? "Weekly" : "每周"}</SelectItem>
                <SelectItem value="monthly">{language === "en" ? "Monthly" : "每月"}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-full">
              {language === "en" ? "Set Budget" : "设置预算"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
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
