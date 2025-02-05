"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExchangeRateProps {
  baseCurrency: string
}

export function ExchangeRate({ baseCurrency }: ExchangeRateProps) {
  const { language } = useLanguage()
  const [rates, setRates] = useState<Record<string, number>>({})
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates")
      }

      const data = await response.json()
      const relevantRates: Record<string, number> = {}

      // Only keep the currencies we're interested in
      const currenciesToShow = ["USD", "EUR", "GBP", "JPY", "CNY"]
      currenciesToShow.forEach((currency) => {
        if (currency !== baseCurrency && data.rates[currency]) {
          relevantRates[currency] = data.rates[currency]
        }
      })

      setRates(relevantRates)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch exchange rates")
    } finally {
      setIsLoading(false)
    }
  }, [baseCurrency, isLoading]) // Added isLoading to dependencies

  useEffect(() => {
    fetchRates()

    // Update rates every 5 minutes
    const interval = setInterval(fetchRates, 300000)

    return () => clearInterval(interval)
  }, [fetchRates])

  return (
    <Card className="w-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{language === "en" ? "Exchange Rates" : "实时汇率"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={fetchRates} disabled={isLoading} className="h-8 w-8">
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <>
            <div className="space-y-2">
              {Object.entries(rates).map(([currency, rate]) => (
                <motion.div
                  key={currency}
                  className="flex justify-between items-center p-2 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="font-medium">
                    1 {baseCurrency} = {rate.toFixed(4)} {currency}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {language === "en" ? "Last updated: " : "最后更新："}
              {lastUpdated.toLocaleTimeString()}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
