"use client"

import { useTransactions } from "../hooks/useTransactions"
import { useLanguage } from "../contexts/LanguageContext"
import { BottomNav } from "../components/BottomNav"
import { MobileHeader } from "../components/MobileHeader"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface Achievement {
  id: string
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  icon: string
  unlocked: boolean
}

export default function AchievementsPage() {
  const { balance, transactions, achievements } = useTransactions()
  const { language, setLanguage } = useLanguage()
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const handleAchievementUnlocked = () => {
      setShowCelebration(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      setTimeout(() => setShowCelebration(false), 3000)
    }

    window.addEventListener("achievementUnlocked", handleAchievementUnlocked)
    return () => {
      window.removeEventListener("achievementUnlocked", handleAchievementUnlocked)
    }
  }, [])

  const achievementsList: Achievement[] = [
    {
      id: "first_transaction",
      title: { en: "First Steps", zh: "第一步" },
      description: { en: "Make your first transaction", zh: "完成您的第一笔交易" },
      icon: "🎉",
      unlocked: achievements.includes("first_transaction"),
    },
    {
      id: "transaction_streak",
      title: { en: "Consistent Tracker", zh: "持续记录者" },
      description: { en: "Record transactions for 7 consecutive days", zh: "连续7天记录交易" },
      icon: "🔥",
      unlocked: achievements.includes("transaction_streak"),
    },
    {
      id: "savings_milestone",
      title: { en: "Savings Milestone", zh: "储蓄里程碑" },
      description: { en: "Reach a balance of 10,000", zh: "余额达到10,000" },
      icon: "💰",
      unlocked: achievements.includes("savings_milestone"),
    },
    {
      id: "diverse_portfolio",
      title: { en: "Diverse Portfolio", zh: "多元化投资" },
      description: { en: "Use 5 different transaction categories", zh: "使用5种不同的交易类别" },
      icon: "🌈",
      unlocked: achievements.includes("diverse_portfolio"),
    },
    {
      id: "big_spender",
      title: { en: "Big Spender", zh: "大手笔" },
      description: { en: "Make a transaction of 1,000 or more", zh: "进行1,000或以上的交易" },
      icon: "💎",
      unlocked: achievements.includes("big_spender"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <MobileHeader onLanguageChange={() => setLanguage(language === "en" ? "zh" : "en")} />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">{language === "en" ? "Achievements" : "成就"}</h1>
        <div className="grid grid-cols-2 gap-4">
          {achievementsList.map((achievement) => (
            <motion.div key={achievement.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                className={`h-full ${achievement.unlocked ? "bg-violet-100 dark:bg-violet-900" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{achievement.title[language]}</span>
                    <span className="text-2xl">{achievement.icon}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description[language]}</p>
                  {achievement.unlocked && <Award className="h-5 w-5 text-violet-600 mt-2" />}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center"
        >
          {language === "en" ? "You've unlocked a new achievement!" : "你解锁了一个新成就！"}
        </motion.div>
      )}
      <BottomNav />
    </div>
  )
}
