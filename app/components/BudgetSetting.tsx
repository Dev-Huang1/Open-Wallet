"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BudgetSettingProps {
  currency: string
  onSetBudget: (budget: { amount: number; period: string } | null) => void
}

type BudgetPeriod = "daily" | "weekly" | "monthly"

export function BudgetSetting({ currency, onSetBudget }: BudgetSettingProps) {
  const { language } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>("daily")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBudget = { amount: Number(budgetAmount), period: budgetPeriod }
    onSetBudget(newBudget)
    setIsDialogOpen(false)
  }

  const getPeriodName = (period: BudgetPeriod) => {
    switch (period) {
      case "daily":
        return language === "en" ? "daily" : "每日"
      case "weekly":
        return language === "en" ? "weekly" : "每周"
      case "monthly":
        return language === "en" ? "monthly" : "每月"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal flex justify-between items-center">
            {language === "en" ? "Set a budget" : "设置预算"}
            <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{language === "en" ? "Set a budget to track your spending" : "设置预算以跟踪您的支出"}</p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Set Budget" : "设置预算"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Select value={budgetPeriod} onValueChange={(value: BudgetPeriod) => setBudgetPeriod(value)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={language === "en" ? "Select budget period" : "选择预算周期"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === "en" ? "Daily" : "每日"}</SelectItem>
                <SelectItem value="weekly">{language === "en" ? "Weekly" : "每周"}</SelectItem>
                <SelectItem value="monthly">{language === "en" ? "Monthly" : "每月"}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full rounded-xl">
              {language === "en" ? "Set Budget" : "设置预算"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
