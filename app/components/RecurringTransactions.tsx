"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface RecurringTransaction {
  id: string
  name: string
  amount: number
  frequency: "daily" | "weekly" | "monthly"
  type: "income" | "expense"
}

interface RecurringTransactionsProps {
  recurringTransactions: RecurringTransaction[]
  onAddRecurringTransaction: (transaction: Omit<RecurringTransaction, "id">) => void
  onDeleteRecurringTransaction: (id: string) => void
}

export function RecurringTransactions({
  recurringTransactions,
  onAddRecurringTransaction,
  onDeleteRecurringTransaction,
}: RecurringTransactionsProps) {
  const { language } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState<Omit<RecurringTransaction, "id">>({
    name: "",
    amount: 0,
    frequency: "monthly",
    type: "expense",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddRecurringTransaction(newTransaction)
    setIsDialogOpen(false)
    setNewTransaction({ name: "", amount: 0, frequency: "monthly", type: "expense" })
  }

  return (
    <Card className="ios-card">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{language === "en" ? "Recurring Transactions" : "定期交易"}</span>
          <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
            {language === "en" ? "Add" : "添加"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recurringTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {language === "en" ? "No recurring transactions" : "暂无定期交易"}
          </p>
        ) : (
          <motion.ul className="space-y-2">
            {recurringTransactions.map((transaction) => (
              <motion.li
                key={transaction.id}
                className="flex justify-between items-center p-2 rounded-lg bg-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span>{transaction.name}</span>
                <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                </span>
                <Button variant="ghost" size="sm" onClick={() => onDeleteRecurringTransaction(transaction.id)}>
                  {language === "en" ? "Delete" : "删除"}
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Add Recurring Transaction" : "添加定期交易"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={language === "en" ? "Transaction name" : "交易名称"}
              value={newTransaction.name}
              onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
              className="rounded-xl ios-input"
              required
            />
            <Input
              type="number"
              placeholder={language === "en" ? "Amount" : "金额"}
              value={newTransaction.amount || ""}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              className="rounded-xl ios-input"
              required
            />
            <Select
              value={newTransaction.frequency}
              onValueChange={(value: "daily" | "weekly" | "monthly") =>
                setNewTransaction({ ...newTransaction, frequency: value })
              }
            >
              <SelectTrigger className="rounded-xl ios-input">
                <SelectValue placeholder={language === "en" ? "Frequency" : "频率"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === "en" ? "Daily" : "每天"}</SelectItem>
                <SelectItem value="weekly">{language === "en" ? "Weekly" : "每周"}</SelectItem>
                <SelectItem value="monthly">{language === "en" ? "Monthly" : "每月"}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newTransaction.type}
              onValueChange={(value: "income" | "expense") => setNewTransaction({ ...newTransaction, type: value })}
            >
              <SelectTrigger className="rounded-xl ios-input">
                <SelectValue placeholder={language === "en" ? "Type" : "类型"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{language === "en" ? "Income" : "收入"}</SelectItem>
                <SelectItem value="expense">{language === "en" ? "Expense" : "支出"}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-full ios-button">
              {language === "en" ? "Add Recurring Transaction" : "添加定期交易"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
