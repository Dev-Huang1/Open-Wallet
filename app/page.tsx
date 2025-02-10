"use client"

import { useState, useEffect } from "react"
import { useTransactions, type Transaction } from "./hooks/useTransactions"
import { useLanguage, LanguageProvider } from "./contexts/LanguageContext"
import { Onboarding } from "./components/Onboarding"
import BalanceDisplay from "./components/BalanceDisplay"
import { MobileHeader } from "./components/MobileHeader"
import { BottomNav } from "./components/BottomNav"
import TransactionList from "./components/TransactionList"
import AddTransactionDialog from "./components/AddTransactionDialog"
import { SuggestedForYou } from "./components/SuggestedForYou"
import { ExchangeRate } from "./components/ExchangeRate"
import { BankCardManager } from "./components/BankCardManager"
import { AchievementsDisplay } from "./components/AchievementsDisplay"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import confetti from "canvas-confetti"

function Home() {
  const {
    balance,
    currency,
    transactions,
    achievements,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setInitialBalance,
    importData,
    exportData,
  } = useTransactions()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [recentChange, setRecentChange] = useState<{ amount: number; type: "increase" | "decrease" } | undefined>()
  const [savingsGoal, setSavingsGoal] = useState<number | null>(null)
  const [budget, setBudget] = useState<{ amount: number; period: string } | null>(null)
  const [isSavingsGoalDialogOpen, setIsSavingsGoalDialogOpen] = useState(false)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [goalAmount, setGoalAmount] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState<"daily" | "weekly" | "monthly">("monthly")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAchievementCelebration, setShowAchievementCelebration] = useState(false)

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted")
    if (onboardingCompleted) {
      setIsOnboardingComplete(true)
    }
  }, [])

  useEffect(() => {
    const handleAchievementUnlocked = () => {
      setShowAchievementCelebration(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      setTimeout(() => setShowAchievementCelebration(false), 3000)
    }

    window.addEventListener("achievementUnlocked", handleAchievementUnlocked)
    return () => {
      window.removeEventListener("achievementUnlocked", handleAchievementUnlocked)
    }
  }, [])

  const handleOnboardingComplete = (name: string, initialBalance: number, selectedCurrency: string) => {
    setInitialBalance(initialBalance, selectedCurrency)
    localStorage.setItem("onboardingCompleted", "true")
    localStorage.setItem("userName", name)
    setIsOnboardingComplete(true)
    toast({
      title: language === "en" ? "Welcome!" : "欢迎！",
      description: language === "en" ? `Your account is ready, ${name}!` : `${name}，您的账户已准备就绪！`,
    })
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

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase())
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchTerm) ||
      transaction.description?.toLowerCase().includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm),
  )

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 pb-20">
      <MobileHeader
        onSearch={handleSearch}
        onImport={importData}
        onExport={exportData}
        onLanguageChange={() => setLanguage(language === "en" ? "zh" : "en")}
      />

      <BalanceDisplay
        balance={balance}
        currency={currency}
        onUpdateBalance={updateBalance}
        onAddTransaction={() => setIsAddTransactionOpen(true)}
        recentChange={recentChange}
        savingsGoal={savingsGoal}
        budget={budget}
      />

      <motion.div
        className="p-4 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SuggestedForYou
          onOpenSavingsGoal={() => setIsSavingsGoalDialogOpen(true)}
          onOpenBudgetSetting={() => setIsBudgetDialogOpen(true)}
        />

        <ExchangeRate baseCurrency={currency} />

        <BankCardManager />

        <AchievementsDisplay achievements={achievements} language={language} />

        <AnimatePresence>
          {sortedTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? language === "en"
                        ? "No matching transactions found"
                        : "未找到匹配的交易"
                      : language === "en"
                        ? "No transactions yet"
                        : "暂无交易记录"}
                  </p>
                  <Button onClick={() => setIsAddTransactionOpen(true)} className="ios-button">
                    {language === "en" ? "Add Transaction" : "添加交易"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <TransactionList
                transactions={sortedTransactions}
                onUpdateTransaction={updateTransaction}
                onDeleteTransaction={deleteTransaction}
                categories={[]}
                currency={currency}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <BottomNav />

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
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const goal = Number(goalAmount)
              if (goal > balance) {
                setSavingsGoal(goal)
                setIsSavingsGoalDialogOpen(false)
                setGoalAmount("")
                toast({
                  title: language === "en" ? "Savings Goal Set" : "储蓄目标已设置",
                  description:
                    language === "en" ? `Your goal is set to ${currency}${goal}` : `您的目标设置为${currency}${goal}`,
                })
              }
            }}
            className="space-y-4"
          >
            <Input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder={language === "en" ? "Enter goal amount" : "输入目标金额"}
              className="rounded-xl ios-input"
              required
              min={balance + 0.01}
              step="0.01"
            />
            <Button type="submit" className="w-full rounded-full ios-button">
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
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const newBudget = { amount: Number(budgetAmount), period: budgetPeriod }
              setBudget(newBudget)
              setIsBudgetDialogOpen(false)
              setBudgetAmount("")
              toast({
                title: language === "en" ? "Budget Set" : "预算已设置",
                description:
                  language === "en"
                    ? `Your ${budgetPeriod} budget is set to ${currency}${newBudget.amount}`
                    : `您的${budgetPeriod === "daily" ? "每日" : budgetPeriod === "weekly" ? "每周" : "每月"}预算设置为${currency}${newBudget.amount}`,
              })
            }}
            className="space-y-4"
          >
            <Input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder={language === "en" ? "Enter budget amount" : "输入预算金额"}
              className="rounded-xl ios-input"
              required
              min="0.01"
              step="0.01"
            />
            <Select
              value={budgetPeriod}
              onValueChange={(value: "daily" | "weekly" | "monthly") => setBudgetPeriod(value)}
            >
              <SelectTrigger className="rounded-xl ios-input">
                <SelectValue placeholder={language === "en" ? "Select budget period" : "选择预算周期"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === "en" ? "Daily" : "每日"}</SelectItem>
                <SelectItem value="weekly">{language === "en" ? "Weekly" : "每周"}</SelectItem>
                <SelectItem value="monthly">{language === "en" ? "Monthly" : "每月"}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-full ios-button">
              {language === "en" ? "Set Budget" : "设置预算"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {showAchievementCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">{language === "en" ? "Congratulations!" : "恭喜！"}</h2>
            <p>{language === "en" ? "You've unlocked a new achievement!" : "你解锁了一个新成就！"}</p>
          </div>
        </motion.div>
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
