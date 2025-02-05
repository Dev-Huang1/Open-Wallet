"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"

interface SavingsGoalProps {
  balance: number
  currency: string
  onSetGoal: (goal: number | null) => void
}

export function SavingsGoal({ balance, currency, onSetGoal }: SavingsGoalProps) {
  const { language } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [goalAmount, setGoalAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGoal = Number(goalAmount)
    if (newGoal > balance) {
      onSetGoal(newGoal)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal flex justify-between items-center">
            {language === "en" ? "Save for a goal" : "为目标储蓄"}
            <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{language === "en" ? "Set a savings goal" : "设置储蓄目标"}</p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Set Savings Goal" : "设置储蓄目标"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full rounded-xl">
              {language === "en" ? "Set Goal" : "设置目标"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
