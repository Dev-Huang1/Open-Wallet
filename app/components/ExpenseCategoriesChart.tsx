"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { motion } from "framer-motion"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Transaction {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
}

interface ExpenseCategoriesChartProps {
  transactions: Transaction[]
}

export function ExpenseCategoriesChart({ transactions }: ExpenseCategoriesChartProps) {
  const { language } = useLanguage()
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense")
    const categories = Array.from(new Set(expenseTransactions.map((t) => t.category)))
    const categoryTotals = categories.map((category) =>
      expenseTransactions.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0),
    )

    const data = {
      labels: categories,
      datasets: [
        {
          data: categoryTotals,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB"],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#36A2EB",
          ],
        },
      ],
    }

    setChartData(data)
  }, [transactions])

  if (!chartData) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="ios-card">
        <CardHeader>
          <CardTitle>{language === "en" ? "Expense Categories" : "支出类别"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
