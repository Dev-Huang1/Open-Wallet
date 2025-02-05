"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Transaction, TransactionCategory } from "../types/transaction"
import { useLanguage } from "../contexts/LanguageContext"
import { ShoppingBag, Utensils, Bus, Film } from "lucide-react"

const categories = [
  { value: "Shopping", label: { en: "Shopping", zh: "购物" }, icon: ShoppingBag },
  { value: "Restaurants", label: { en: "Restaurants", zh: "餐厅" }, icon: Utensils },
  { value: "Transport", label: { en: "Transport", zh: "交通" }, icon: Bus },
  { value: "Entertainment", label: { en: "Entertainment", zh: "娱乐" }, icon: Film },
] as const

interface AddTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void
}

export default function AddTransactionDialog({ isOpen, onClose, onAddTransaction }: AddTransactionDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState<TransactionCategory>("Shopping")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const { language } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTransaction({
      name,
      amount: Number(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      description,
    })
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setAmount("")
    setType("expense")
    setCategory("Shopping")
    setDate("")
    setDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === "en" ? "Add New Transaction" : "添加新交易"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={language === "en" ? "Transaction name" : "交易名称"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder={language === "en" ? "Amount" : "金额"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Select value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === "en" ? "Transaction type" : "交易类型"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">{language === "en" ? "Income" : "收入"}</SelectItem>
              <SelectItem value="expense">{language === "en" ? "Expense" : "支出"}</SelectItem>
            </SelectContent>
          </Select>
          {type === "expense" && (
            <Select value={category} onValueChange={(value: TransactionCategory) => setCategory(value)}>
              <SelectTrigger>
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
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Textarea
            placeholder={language === "en" ? "Description (optional)" : "描述（可选）"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {language === "en" ? "Add Transaction" : "添加交易"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
