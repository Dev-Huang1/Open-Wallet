"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ListIcon as ListDetails } from "lucide-react"
import { currencySymbols, currencyOptions } from "../utils/currencies"
import { motion } from "framer-motion"

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

  const scrollToTransactions = () => {
    const element = document.getElementById("transactions")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const currencySymbol = currencySymbols[currency] || currency

  return (
    <motion.div
      className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg opacity-80 mb-2">
          {language === "en" ? "Main Account" : "主账户"} · {currency}
        </h2>
        <motion.div
          className="text-5xl font-bold mb-4"
          onClick={() => setIsDialogOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currencySymbol}
          {balance.toFixed(2)}
        </motion.div>
        <Button
          variant="ghost"
          className="rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          {language === "en" ? "Account" : "账户"}
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 max-w-md mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 hover:text-white mb-2"
            onClick={onAddTransaction}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <p className="text-sm">{language === "en" ? "Add" : "添加"}</p>
        </div>
        <div className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 hover:text-white mb-2"
            onClick={scrollToTransactions}
          >
            <ListDetails className="h-6 w-6" />
          </Button>
          <p className="text-sm">{language === "en" ? "Details" : "明细"}</p>
        </div>
      </motion.div>

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
              className="rounded-xl ios-input"
              required
            />
            <Select value={newCurrency} onValueChange={setNewCurrency}>
              <SelectTrigger className="rounded-xl ios-input">
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
            <Button type="submit" className="w-full rounded-full ios-button">
              {language === "en" ? "Update" : "更新"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
