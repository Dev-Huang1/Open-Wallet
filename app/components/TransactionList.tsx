"use client"

import { useState } from "react"
import type { Transaction, TransactionCategory } from "../hooks/useTransactions"
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { currencySymbols } from "../utils/currencies"

interface TransactionListProps {
  transactions: Transaction[]
  onUpdateTransaction: (updatedTransaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
  categories: { value: TransactionCategory; label: { en: string; zh: string }; icon: any }[]
  currency: string
}

export default function TransactionList({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
  categories,
  currency,
}: TransactionListProps) {
  const { language } = useLanguage()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTransaction) {
      onUpdateTransaction(editingTransaction)
      setEditingTransaction(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold px-1">{language === "en" ? "Transaction History" : "交易记录"}</h2>
      {transactions.length === 0 ? (
        <motion.p
          className="text-center text-muted-foreground p-4 bg-card rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {language === "en" ? "No transactions yet" : "暂无交易记录"}
        </motion.p>
      ) : (
        <AnimatePresence>
          <motion.ul className="space-y-3">
            {transactions.map((transaction) => (
              <motion.li
                key={transaction.id}
                className="bg-card rounded-xl p-4 card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {currencySymbols[currency] || currency}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-secondary"
                        onClick={() => handleEditClick(transaction)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-secondary"
                        onClick={() => onDeleteTransaction(transaction.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Edit Transaction" : "编辑交易"}</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                value={editingTransaction.name}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, name: e.target.value })}
                placeholder={language === "en" ? "Transaction name" : "交易名称"}
                className="rounded-xl"
              />
              <Input
                type="number"
                value={editingTransaction.amount}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: Number(e.target.value) })}
                placeholder={language === "en" ? "Amount" : "金额"}
                className="rounded-xl"
              />
              <Select
                value={editingTransaction.type}
                onValueChange={(value: "income" | "expense") =>
                  setEditingTransaction({ ...editingTransaction, type: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={language === "en" ? "Transaction type" : "交易类型"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{language === "en" ? "Income" : "收入"}</SelectItem>
                  <SelectItem value="expense">{language === "en" ? "Expense" : "支出"}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={editingTransaction.date.split("T")[0]}
                onChange={(e) =>
                  setEditingTransaction({ ...editingTransaction, date: new Date(e.target.value).toISOString() })
                }
                className="rounded-xl"
              />
              <Textarea
                value={editingTransaction.description || ""}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                placeholder={language === "en" ? "Description (optional)" : "描述（可选）"}
                className="rounded-xl"
              />
              {editingTransaction.type === "expense" && (
                <Select
                  value={editingTransaction.category}
                  onValueChange={(value: TransactionCategory) =>
                    setEditingTransaction({ ...editingTransaction, category: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={language === "en" ? "Category" : "类别"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          {label[language]}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button type="submit" className="w-full rounded-xl">
                {language === "en" ? "Update Transaction" : "更新交易"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
