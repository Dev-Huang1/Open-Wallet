import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AchievementsDisplayProps {
  achievements: string[]
  language: string
}

export function AchievementsDisplay({ achievements, language }: AchievementsDisplayProps) {
  const achievementsList = [
    {
      id: "first_transaction",
      title: { en: "First Steps", zh: "第一步" },
      description: { en: "Make your first transaction", zh: "完成您的第一笔交易" },
      icon: "🎉",
    },
    {
      id: "transaction_streak",
      title: { en: "Consistent Tracker", zh: "持续记录者" },
      description: { en: "Record transactions for 7 consecutive days", zh: "连续7天记录交易" },
      icon: "🔥",
    },
    {
      id: "savings_milestone",
      title: { en: "Savings Milestone", zh: "储蓄里程碑" },
      description: { en: "Reach a balance of 10,000", zh: "余额达到10,000" },
      icon: "💰",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{language === "en" ? "Achievements" : "成就"}</h2>
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {achievementsList.map((achievement) => (
          <motion.div
            key={achievement.id}
            className="flex-shrink-0 w-48"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`h-full ${achievements.includes(achievement.id) ? "bg-violet-100 dark:bg-violet-900" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{achievement.title[language]}</span>
                  <span className="text-2xl">{achievement.icon}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description[language]}</p>
                {achievements.includes(achievement.id) && <Award className="h-5 w-5 text-violet-600 mt-2" />}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <motion.div className="flex-shrink-0 w-48" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/achievements">
            <Card className="bg-primary text-primary-foreground h-full flex items-center justify-center">
              <CardContent>
                <p className="text-center text-lg font-semibold">
                  {language === "en" ? "View All Achievements" : "查看所有成就"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
