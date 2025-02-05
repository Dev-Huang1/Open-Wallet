import { useLanguage } from "../contexts/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import { PiggyBankIcon, CalculatorIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

interface SuggestedForYouProps {
  onOpenSavingsGoal: () => void
  onOpenBudgetSetting: () => void
}

export function SuggestedForYou({ onOpenSavingsGoal, onOpenBudgetSetting }: SuggestedForYouProps) {
  const { language } = useLanguage()

  const suggestions = [
    {
      title: language === "en" ? "Save for a goal" : "为目标储蓄",
      description: language === "en" ? "Set a savings target" : "设置储蓄目标",
      action: onOpenSavingsGoal,
      icon: PiggyBankIcon,
      gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: language === "en" ? "Set a budget" : "设置预算",
      description: language === "en" ? "Track your spending" : "跟踪您的支出",
      action: onOpenBudgetSetting,
      icon: CalculatorIcon,
      gradient: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: language === "en" ? "Analyze spending" : "分析支出",
      description: language === "en" ? "View insights" : "查看分析",
      link: "/analytics",
      icon: TrendingUpIcon,
      gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 px-2">{language === "en" ? "Suggested" : "建议"}</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 px-2" style={{ minWidth: "min-content" }}>
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className={`rounded-2xl cursor-pointer transition-all flex-shrink-0 ${suggestion.gradient}`}
              style={{ width: "160px", height: "160px" }}
              onClick={suggestion.action}
            >
              {suggestion.link ? (
                <Link href={suggestion.link} className="block h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full text-white">
                    <suggestion.icon className="h-8 w-8" />
                    <div>
                      <h3 className="font-medium mb-1">{suggestion.title}</h3>
                      <p className="text-sm text-white/80">{suggestion.description}</p>
                    </div>
                  </CardContent>
                </Link>
              ) : (
                <CardContent className="p-4 flex flex-col justify-between h-full text-white">
                  <suggestion.icon className="h-8 w-8" />
                  <div>
                    <h3 className="font-medium mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-white/80">{suggestion.description}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
