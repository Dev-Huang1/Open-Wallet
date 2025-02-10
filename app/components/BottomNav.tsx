"use client"

import { Home, BarChart2, Award } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "../contexts/LanguageContext"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const { language } = useLanguage()

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2">
      <div className="flex justify-around items-center">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center p-2 text-sm",
            pathname === "/" ? "text-violet-600" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          {language === "en" ? "Home" : "主页"}
        </Link>
        <Link
          href="/analytics"
          className={cn(
            "flex flex-col items-center p-2 text-sm",
            pathname === "/analytics" ? "text-violet-600" : "text-muted-foreground",
          )}
        >
          <BarChart2 className="h-5 w-5 mb-1" />
          {language === "en" ? "Analytics" : "分析"}
        </Link>
        <Link
          href="/achievements"
          className={cn(
            "flex flex-col items-center p-2 text-sm",
            pathname === "/achievements" ? "text-violet-600" : "text-muted-foreground",
          )}
        >
          <Award className="h-5 w-5 mb-1" />
          {language === "en" ? "Achievements" : "成就"}
        </Link>
      </div>
    </div>
  )
}
