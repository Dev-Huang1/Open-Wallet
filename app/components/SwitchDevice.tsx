"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTransactions } from "../hooks/useTransactions"
import { toast } from "@/components/ui/use-toast"
import QrScanner from "qr-scanner"
import { QRCodeDisplay } from "./QRCodeDisplay"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SwitchDevice() {
  const { language } = useLanguage()
  const { balance, currency, transactions, achievements, importData } = useTransactions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deviceType, setDeviceType] = useState<"old" | "new" | null>(null)
  const [qrData, setQrData] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)

  const handleSwitchDevice = () => {
    setIsDialogOpen(true)
  }

  const handleDeviceSelection = (type: "old" | "new") => {
    setDeviceType(type)
    if (type === "old") {
      const data = JSON.stringify({ balance, currency, transactions, achievements })
      setQrData(data)
    } else {
      setQrData("")
      startScanner()
    }
  }

  const startScanner = () => {
    if (videoRef.current) {
      scannerRef.current = new QrScanner(videoRef.current, (result) => handleScan(result.data), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      })
      scannerRef.current.start()
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy()
      scannerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [scannerRef]) // Added scannerRef to dependencies

  const handleScan = (result: string) => {
    try {
      const parsedData = JSON.parse(result)
      if (
        parsedData.balance !== undefined &&
        parsedData.currency &&
        parsedData.transactions &&
        parsedData.achievements
      ) {
        setScannedData(parsedData)
        setIsAlertOpen(true)
        stopScanner()
      } else {
        throw new Error("Invalid QR code")
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Invalid QR Code" : "无效的二维码",
        description: language === "en" ? "Please scan a valid QR code." : "请扫描有效的二维码。",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await QrScanner.scanImage(file)
        handleScan(result)
      } catch (error) {
        toast({
          title: language === "en" ? "Invalid QR Code" : "无效的二维码",
          description: language === "en" ? "Please upload a valid QR code image." : "请上传有效的二维码图片。",
          variant: "destructive",
        })
      }
    }
  }

  const handleConfirmImport = () => {
    if (scannedData) {
      importData(scannedData)
      setIsAlertOpen(false)
      setIsDialogOpen(false)
      toast({
        title: language === "en" ? "Data Imported Successfully" : "数据导入成功",
        description: language === "en" ? "Your account has been updated." : "您的账户已更新。",
      })
    }
  }

  const handleCancel = () => {
    setDeviceType(null)
    setQrData("")
    stopScanner()
  }

  return (
    <>
      <Button onClick={handleSwitchDevice}>{language === "en" ? "Switch Device" : "切换设备"}</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Switch Device" : "切换设备"}</DialogTitle>
          </DialogHeader>
          {!deviceType && (
            <div className="flex flex-col space-y-4">
              <Button onClick={() => handleDeviceSelection("old")}>
                {language === "en" ? "This is my old device" : "这是我的旧设备"}
              </Button>
              <Button onClick={() => handleDeviceSelection("new")}>
                {language === "en" ? "This is my new device" : "这是我的新设备"}
              </Button>
            </div>
          )}
          {deviceType === "old" && qrData && <QRCodeDisplay data={qrData} onCancel={handleCancel} />}
          {deviceType === "new" && (
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <video ref={videoRef} width="300" height="300" style={{ objectFit: "cover" }}></video>
              <p className="text-center text-sm text-gray-500">
                {language === "en" ? "Scan the QR code from your old device" : "扫描旧设备上的二维码"}
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                {language === "en" ? "Upload QR Code Image" : "上传二维码图片"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button onClick={handleCancel}>{language === "en" ? "Cancel" : "取消"}</Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Confirm Data Import" : "确认数据导入"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "Do you want to replace the data on this device with the scanned data?"
                : "您是否要用扫描的数据替换此设备上的数据？"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === "en" ? "Cancel" : "取消"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              {language === "en" ? "Confirm" : "确认"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
