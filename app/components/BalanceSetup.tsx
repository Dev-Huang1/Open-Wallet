import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "../contexts/LanguageContext"

interface BalanceSetupProps {
  onSetBalance: (amount: number, currency: string) => void
}

const currencyOptions = [
  { value: "USD", symbol: "$", name: "US Dollar" },
  { value: "EUR", symbol: "€", name: "Euro" },
  { value: "GBP", symbol: "£", name: "British Pound" },
  { value: "JPY", symbol: "¥", name: "Japanese Yen" },
  { value: "CNY", symbol: "¥", name: "Chinese Yuan" },
]

export default function BalanceSetup({ onSetBalance }: BalanceSetupProps) {
  const { language } = useLanguage()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSetBalance(Number(amount), currency)
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
          {currencyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.symbol} - {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full">
        {language === "en" ? "Confirm" : "确认"}
      </Button>
    </form>
  )
}
