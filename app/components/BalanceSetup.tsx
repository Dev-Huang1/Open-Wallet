import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "../contexts/LanguageContext"

interface BalanceSetupProps {
  onSetBalance: (amount: number, currency: string) => void
}

export default function BalanceSetup({ onSetBalance }: BalanceSetupProps) {
  const { language } = useLanguage()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("CNY")
  const [customCurrency, setCustomCurrency] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSetBalance(Number(amount), currency === "custom" ? customCurrency : currency)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{language === "en" ? "Set Initial Balance" : "设置初始余额"}</h1>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={language === "en" ? "Enter current balance" : "输入当前余额"}
        required
      />
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger>
          <SelectValue placeholder={language === "en" ? "Select currency" : "选择货币"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CNY">CNY</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="custom">{language === "en" ? "Custom" : "自定义"}</SelectItem>
        </SelectContent>
      </Select>
      {currency === "custom" && (
        <Input
          value={customCurrency}
          onChange={(e) => setCustomCurrency(e.target.value)}
          placeholder={language === "en" ? "Enter custom currency" : "输入自定义货币"}
          required
        />
      )}
      <Button type="submit" className="w-full">
        {language === "en" ? "Confirm" : "确认"}
      </Button>
    </form>
  )
}
