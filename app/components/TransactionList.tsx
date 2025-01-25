import { useState } from "react"
import type { Transaction } from "../hooks/useTransactions"
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface TransactionListProps {
  transactions: Transaction[]
  onUpdateTransaction: (updatedTransaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
}

export default function TransactionList({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
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
      <h2 className="text-xl font-semibold">{language === "en" ? "Transaction History" : "交易记录"}</h2>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">{language === "en" ? "No transactions yet" : "暂无交易记录"}</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                {transaction.type === "income" ? (
                  <ArrowUpIcon className="text-green-500 mr-2" />
                ) : (
                  <ArrowDownIcon className="text-red-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className={`font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {transaction.amount.toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(transaction)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTransaction(transaction.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Edit Transaction" : "编辑交易"}</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                value={editingTransaction.name}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, name: e.target.value })}
                placeholder={language === "en" ? "Transaction name" : "交易名称"}
              />
              <Input
                type="number"
                value={editingTransaction.amount}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: Number(e.target.value) })}
                placeholder={language === "en" ? "Amount" : "金额"}
              />
              <Select
                value={editingTransaction.type}
                onValueChange={(value: "income" | "expense") =>
                  setEditingTransaction({ ...editingTransaction, type: value })
                }
              >
                <SelectTrigger>
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
              />
              <Textarea
                value={editingTransaction.description || ""}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                placeholder={language === "en" ? "Description (optional)" : "描述（可选）"}
              />
              <Button type="submit" className="w-full">
                {language === "en" ? "Update Transaction" : "更新交易"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
