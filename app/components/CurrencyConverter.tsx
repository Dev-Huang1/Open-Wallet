import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "../contexts/LanguageContext"

const currencies = ["USD", "EUR", "GBP", "JPY", "CNY"]

interface CurrencyConverterProps {
  amount: number
  baseCurrency: string
  onCurrencyChange: (newCurrency: string, convertedAmount: number) => void
}

export function CurrencyConverter({ amount, baseCurrency, onCurrencyChange }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency)
  const [convertedAmount, setConvertedAmount] = useState(amount)
  const { language } = useLanguage()

  useEffect(() => {
    // In a real app, you would fetch real-time exchange rates here
    const mockExchangeRates: { [key: string]: number } = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CNY: 6.5,
    }

    const baseRate = mockExchangeRates[baseCurrency]
    const targetRate = mockExchangeRates[selectedCurrency]
    const converted = (amount / baseRate) * targetRate

    setConvertedAmount(converted)
    onCurrencyChange(selectedCurrency, converted)
  }, [amount, baseCurrency, selectedCurrency, onCurrencyChange])

  return (
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold">{convertedAmount.toFixed(2)}</span>
      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={language === "en" ? "Currency" : "货币"} />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
