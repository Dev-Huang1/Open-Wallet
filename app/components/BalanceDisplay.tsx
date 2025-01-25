"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BalanceDisplayProps {
  balance: number
  currency: string
  onUpdateBalance: (newBalance: number) => void
}

export default function BalanceDisplay({ balance, currency, onUpdateBalance }: BalanceDisplayProps) {
  const { language } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBalance, setNewBalance] = useState(balance.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateBalance(Number(newBalance))
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="text-center cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Current Balance" : "当前余额"}</h1>
        <p className="text-4xl font-semibold">
          {balance.toFixed(2)} {currency}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Update Balance" : "更新余额"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder={language === "en" ? "Enter new balance" : "输入新余额"}
              required
            />
            <Button type="submit" className="w-full">
              {language === "en" ? "Update" : "更新"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
