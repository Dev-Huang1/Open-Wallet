import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Transaction } from "../hooks/useTransactions"
import { useLanguage } from "../contexts/LanguageContext"

interface AddTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void
}

export default function AddTransactionDialog({ isOpen, onClose, onAddTransaction }: AddTransactionDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const { language } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTransaction({
      name,
      amount: Number(amount),
      type,
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
