"use client"

import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { useLanguage } from "../contexts/LanguageContext"
import { Button } from "@/components/ui/button"

interface QRCodeDisplayProps {
  data: string
  onCancel: () => void
}

export function QRCodeDisplay({ data, onCancel }: QRCodeDisplayProps) {
  const { language } = useLanguage()

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white p-8 rounded-3xl shadow-2xl"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <QRCodeSVG value={data} size={256} />
        </motion.div>
      </motion.div>
      <motion.p
        className="mt-8 text-white text-xl font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {language === "en" ? "Scan this QR code with your new device" : "使用新设备扫描此二维码"}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button onClick={onCancel} className="mt-4 bg-white text-indigo-600 hover:bg-indigo-100">
          {language === "en" ? "Cancel" : "取消"}
        </Button>
      </motion.div>
    </motion.div>
  )
}
