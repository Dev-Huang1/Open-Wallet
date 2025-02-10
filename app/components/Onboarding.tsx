"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../contexts/LanguageContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencyOptions } from "../utils/currencies"
import CryptoJS from "crypto-js"

interface OnboardingProps {
  onComplete: (name: string, initialBalance: number, currency: string) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { language } = useLanguage()
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [passcode, setPasscode] = useState("")
  const [confirmPasscode, setConfirmPasscode] = useState("")

  const steps = [
    {
      title: language === "en" ? "Welcome" : "欢迎",
      description: language === "en" ? "Let's set up your account" : "让我们设置您的账户",
      content: (
        <Input
          type="text"
          placeholder={language === "en" ? "Enter your name" : "输入您的姓名"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ios-input"
        />
      ),
    },
    {
      title: language === "en" ? "Initial Balance" : "初始余额",
      description: language === "en" ? "What's your current balance?" : "您当前的余额是多少？",
      content: (
        <Input
          type="number"
          placeholder={language === "en" ? "Enter initial balance" : "输入初始余额"}
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="ios-input"
        />
      ),
    },
    {
      title: language === "en" ? "Currency" : "货币",
      description: language === "en" ? "Choose your primary currency" : "选择您的主要货币",
      content: (
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="ios-input">
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
      ),
    },
    {
      title: language === "en" ? "Set Passcode" : "设置密码",
      description: language === "en" ? "Create a 6-digit passcode" : "创建6位数字密码",
      content: (
        <>
          <Input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder={language === "en" ? "Enter 6-digit passcode" : "输入6位数字密码"}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="ios-input mb-4"
          />
          <Input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder={language === "en" ? "Confirm passcode" : "确认密码"}
            value={confirmPasscode}
            onChange={(e) => setConfirmPasscode(e.target.value)}
            className="ios-input"
          />
        </>
      ),
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = (skipPasscode = false) => {
    if (!skipPasscode && passcode !== confirmPasscode) {
      alert(language === "en" ? "Passcodes do not match" : "密码不匹配")
      return
    }
    if (!skipPasscode) {
      const encryptedPasscode = CryptoJS.AES.encrypt(passcode, "secret_key").toString()
      localStorage.setItem("encryptedPasscode", encryptedPasscode)
    }
    onComplete(name, Number(initialBalance), currency)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">{steps[step].title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{steps[step].description}</p>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="mt-8 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={handleNext} className="w-full ios-button">
            {step === steps.length - 1
              ? language === "en"
                ? "Complete"
                : "完成"
              : language === "en"
                ? "Next"
                : "下一步"}
          </Button>
          {step === steps.length - 1 && (
            <Button onClick={() => handleComplete(true)} variant="outline" className="w-full">
              {language === "en" ? "Skip Passcode" : "跳过密码设置"}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
