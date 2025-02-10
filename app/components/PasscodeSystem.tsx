"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import CryptoJS from "crypto-js"

interface PasscodeSystemProps {
  onPasscodeSet: () => void
  onPasscodeVerified: () => void
}

export function PasscodeSystem({ onPasscodeSet, onPasscodeVerified }: PasscodeSystemProps) {
  const { language } = useLanguage()
  const [passcode, setPasscode] = useState("")
  const [confirmPasscode, setConfirmPasscode] = useState("")
  const [isSettingPasscode, setIsSettingPasscode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const storedPasscode = localStorage.getItem("encryptedPasscode")
    if (storedPasscode) {
      setIsVerifying(true)
    } else {
      setIsSettingPasscode(true)
    }
  }, [])

  const handleSetPasscode = () => {
    if (passcode.length !== 6) {
      toast({
        title: language === "en" ? "Invalid Passcode" : "无效的密码",
        description: language === "en" ? "Passcode must be 6 digits" : "密码必须为6位数字",
        variant: "destructive",
      })
      return
    }

    if (passcode !== confirmPasscode) {
      toast({
        title: language === "en" ? "Passcode Mismatch" : "密码不匹配",
        description: language === "en" ? "Passcodes do not match" : "两次输入的密码不一致",
        variant: "destructive",
      })
      return
    }

    const encryptedPasscode = CryptoJS.AES.encrypt(passcode, "secret_key").toString()
    localStorage.setItem("encryptedPasscode", encryptedPasscode)
    onPasscodeSet()
  }

  const handleVerifyPasscode = () => {
    const storedPasscode = localStorage.getItem("encryptedPasscode")
    if (storedPasscode) {
      const decryptedPasscode = CryptoJS.AES.decrypt(storedPasscode, "secret_key").toString(CryptoJS.enc.Utf8)
      if (passcode === decryptedPasscode) {
        onPasscodeVerified()
      } else {
        toast({
          title: language === "en" ? "Incorrect Passcode" : "密码错误",
          description: language === "en" ? "Please try again" : "请重试",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isSettingPasscode
              ? language === "en"
                ? "Set Passcode"
                : "设置密码"
              : language === "en"
                ? "Enter Passcode"
                : "输入密码"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={language === "en" ? "Enter 6-digit passcode" : "输入6位数字密码"}
            className="text-center text-2xl tracking-widest"
          />
          {isSettingPasscode && (
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              placeholder={language === "en" ? "Confirm passcode" : "确认密码"}
              className="text-center text-2xl tracking-widest"
            />
          )}
          <Button onClick={isSettingPasscode ? handleSetPasscode : handleVerifyPasscode} className="w-full ios-button">
            {isSettingPasscode
              ? language === "en"
                ? "Set Passcode"
                : "设置密码"
              : language === "en"
                ? "Verify"
                : "验证"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
