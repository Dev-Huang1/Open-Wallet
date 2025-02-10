"use client"

import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { SwitchDevice } from "./SwitchDevice"

interface MobileHeaderProps {
  onSearch: (term: string) => void
  onLanguageChange: () => void
}

export function MobileHeader({ onSearch, onLanguageChange }: MobileHeaderProps) {
  const { language } = useLanguage()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md p-4 space-y-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 mx-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder={language === "en" ? "Search..." : "搜索..."}
            className="w-full bg-gray-100 border-0 pl-10 rounded-full ios-input"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{language === "en" ? "Menu" : "菜单"}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <SwitchDevice />
              <Button variant="ghost" className="w-full justify-start" onClick={onLanguageChange}>
                {language === "en" ? "切换至中文" : "Switch to English"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  )
}
