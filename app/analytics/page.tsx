"use client"

import { useTransactions } from "../hooks/useTransactions"
import { useLanguage } from "../contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MobileHeader } from "../components/MobileHeader"
import { BottomNav } from "../components/BottomNav"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag, Utensils, Bus, Film } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useState } from "react"
import { currencySymbols } from "../utils/currencies"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const categories = [
  { name: "Shopping", icon: ShoppingBag, color: "text-pink-500" },
  { name: "Restaurants", icon: Utensils, color: "text-orange-500" },
  { name: "Transport", icon: Bus, color: "text-blue-500" },
  { name: "Entertainment", icon: Film, color: "text-purple-500" },
] as const

export default function AnalyticsPage() {
  const { transactions, currency } = useTransactions()
  const { language, setLanguage } = useLanguage()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")

  const getDateRange = () => {
    const now = new Date()
    const start = new Date()
    if (timeRange === "week") {
      start.setDate(now.getDate() - 7)
    } else if (timeRange === "month") {
      start.setMonth(now.getMonth() - 1)
    } else if (timeRange === "year") {
      start.setFullYear(now.getFullYear() - 1)
    }
    return { start, end: now }
  }

  const getTransactionsInRange = () => {
    const { start, end } = getDateRange()
    return transactions.filter((t) => {
      const date = new Date(t.date)
      return date >= start && date <= end && t.type === "expense"
    })
  }

  const transactionsInRange = getTransactionsInRange()
  const totalSpend = transactionsInRange.reduce((sum, t) => sum + t.amount, 0)

  const getCategoryTotal = (category: string) => {
    return transactionsInRange.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0)
  }

  const getChartData = () => {
    if (timeRange === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const dailyTotals = new Array(7).fill(0)

      transactionsInRange.forEach((t) => {
        const date = new Date(t.date)
        const dayIndex = date.getDay()
        dailyTotals[dayIndex] += t.amount
      })

      return {
        labels: days,
        datasets: [
          {
            data: dailyTotals,
            backgroundColor: "#2563EB",
            borderRadius: 8,
          },
        ],
      }
    } else if (timeRange === "month") {
      const monthlyTotals = new Array(30).fill(0)

      transactionsInRange.forEach((t) => {
        const date = new Date(t.date)
        const dayIndex = date.getDate() - 1
        monthlyTotals[dayIndex] += t.amount
      })

      return {
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
        datasets: [
          {
            data: monthlyTotals,
            backgroundColor: "#2563EB",
            borderRadius: 8,
          },
        ],
      }
    } else {
      const monthlyTotals = new Array(12).fill(0)

      transactionsInRange.forEach((t) => {
        const date = new Date(t.date)
        const monthIndex = date.getMonth()
        monthlyTotals[monthIndex] += t.amount
      })

      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            data: monthlyTotals,
            backgroundColor: "#2563EB",
            borderRadius: 8,
          },
        ],
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{language === "en" ? "Analytics" : "分析"}</h1>
              <MobileHeader onLanguageChange={() => setLanguage(language === "en" ? "zh" : "en")} />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">
                  {new Date().toLocaleDateString(language === "en" ? "en-US" : "zh-CN", {
                    month: "short",
                    day: "numeric",
                  })}
                </CardTitle>
                <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">{language === "en" ? "Week" : "周"}</SelectItem>
                    <SelectItem value="month">{language === "en" ? "Month" : "月"}</SelectItem>
                    <SelectItem value="year">{language === "en" ? "Year" : "年"}</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {currencySymbols[currency] || currency} {totalSpend.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">{language === "en" ? "Total spend" : "总支出"}</div>
                <Bar
                  data={getChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: {
                        grid: { color: "rgba(0,0,0,0.1)" },
                        ticks: { callback: (value) => `${currencySymbols[currency] || currency}${value}` },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-4 mt-4 lg:mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">{language === "en" ? "Categories" : "类别"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => {
                  const total = getCategoryTotal(category.name)
                  const percentage = totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0
                  const transactionCount = transactionsInRange.filter((t) => t.category === category.name).length

                  return (
                    <motion.div
                      key={category.name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${category.color}`}>
                          <category.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {transactionCount} {language === "en" ? "transactions" : "笔交易"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {currencySymbols[currency] || currency} {total.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">{percentage}%</p>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
