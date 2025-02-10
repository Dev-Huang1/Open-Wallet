"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Edit2 } from "lucide-react"
import CryptoJS from "crypto-js"

interface BankCard {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  provider: string
}

const gradients = [
  "bg-gradient-to-r from-blue-400 to-blue-600",
  "bg-gradient-to-r from-purple-400 to-purple-600",
  "bg-gradient-to-r from-green-400 to-green-600",
  "bg-gradient-to-r from-red-400 to-red-600",
  "bg-gradient-to-r from-yellow-400 to-yellow-600",
]

const getCardProvider = (cardNumber: string): string => {
  const prefix = cardNumber.substring(0, 2)
  if (prefix === "41") return "Visa"
  if (prefix === "51" || prefix === "52" || prefix === "53" || prefix === "54" || prefix === "55") return "Mastercard"
  if (prefix === "34" || prefix === "37") return "American Express"
  if (prefix === "60") return "Discover"
  if (prefix === "62") return "UnionPay"
  return "Unknown"
}

export function BankCardManager() {
  const { language } = useLanguage()
  const [cards, setCards] = useState<BankCard[]>([])
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isEditingCard, setIsEditingCard] = useState<string | null>(null)
  const [newCard, setNewCard] = useState<Omit<BankCard, "id" | "provider">>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [showFullCardNumber, setShowFullCardNumber] = useState<string | null>(null)

  useEffect(() => {
    const encryptedCards = localStorage.getItem("encryptedCards")
    if (encryptedCards) {
      const decryptedCards = JSON.parse(CryptoJS.AES.decrypt(encryptedCards, "secret_key").toString(CryptoJS.enc.Utf8))
      setCards(decryptedCards)
    }
  }, [])

  const saveCards = (updatedCards: BankCard[]) => {
    const encryptedCards = CryptoJS.AES.encrypt(JSON.stringify(updatedCards), "secret_key").toString()
    localStorage.setItem("encryptedCards", encryptedCards)
  }

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate || !newCard.cvv) {
      toast({
        title: language === "en" ? "Invalid Card Details" : "无效的卡片信息",
        description: language === "en" ? "Please fill in all fields" : "请填写所有字段",
        variant: "destructive",
      })
      return
    }

    const provider = getCardProvider(newCard.cardNumber)
    const updatedCards = [...cards, { ...newCard, id: Date.now().toString(), provider }]
    setCards(updatedCards)
    saveCards(updatedCards)
    setIsAddingCard(false)
    setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" })
    toast({
      title: language === "en" ? "Card Added" : "卡片已添加",
      description: language === "en" ? "Your card has been saved" : "您的卡片已保存",
    })
  }

  const handleUpdateCard = () => {
    if (!isEditingCard) return

    const updatedCards = cards.map((card) =>
      card.id === isEditingCard ? { ...newCard, id: card.id, provider: getCardProvider(newCard.cardNumber) } : card,
    )
    setCards(updatedCards)
    saveCards(updatedCards)
    setIsEditingCard(null)
    setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" })
    toast({
      title: language === "en" ? "Card Updated" : "卡片已更新",
      description: language === "en" ? "Your card has been updated" : "您的卡片已更新",
    })
  }

  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter((card) => card.id !== id)
    setCards(updatedCards)
    saveCards(updatedCards)
    toast({
      title: language === "en" ? "Card Deleted" : "卡片已删除",
      description: language === "en" ? "Your card has been removed" : "您的卡片已移除",
    })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{language === "en" ? "Bank Cards" : "银行卡"}</h2>
        <Button variant="outline" onClick={() => setIsAddingCard(true)}>
          {language === "en" ? "Add Card" : "添加卡片"}
        </Button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4" style={{ minWidth: "min-content" }}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`w-80 h-48 ${gradients[index % gradients.length]} text-white rounded-xl shadow-lg`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="text-lg font-bold">{card.cardHolder}</div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white p-0"
                      onClick={() => {
                        setIsEditingCard(card.id)
                        setNewCard(card)
                      }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white p-0"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      &times;
                    </Button>
                  </div>
                </div>
                <div className="text-xl font-mono mt-4">
                  {showFullCardNumber === card.id
                    ? formatCardNumber(card.cardNumber)
                    : "**** **** **** " + card.cardNumber.slice(-4)}
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <div className="text-xs opacity-75">{language === "en" ? "Expires" : "有效期"}</div>
                    <div>{card.expiryDate}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">{card.provider}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white p-0"
                      onPointerDown={() => setShowFullCardNumber(card.id)}
                      onPointerUp={() => setShowFullCardNumber(null)}
                      onPointerLeave={() => setShowFullCardNumber(null)}
                    >
                      {showFullCardNumber === card.id ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={isAddingCard || isEditingCard !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingCard(false)
            setIsEditingCard(null)
            setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingCard
                ? language === "en"
                  ? "Edit Card"
                  : "编辑卡片"
                : language === "en"
                  ? "Add New Card"
                  : "添加新卡片"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={language === "en" ? "Card Number" : "卡号"}
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
              maxLength={19}
            />
            <Input
              placeholder={language === "en" ? "Card Holder" : "持卡人"}
              value={newCard.cardHolder}
              onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
            />
            <Input
              placeholder={language === "en" ? "Expiry Date (MM/YY)" : "有效期 (月/年)"}
              value={newCard.expiryDate}
              onChange={(e) => setNewCard({ ...newCard, expiryDate: formatExpiryDate(e.target.value) })}
              maxLength={5}
            />
            <Input
              placeholder={language === "en" ? "CVV" : "安全码"}
              value={newCard.cvv}
              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              maxLength={4}
            />
            <Button onClick={isEditingCard ? handleUpdateCard : handleAddCard} className="w-full">
              {isEditingCard
                ? language === "en"
                  ? "Update Card"
                  : "更新卡片"
                : language === "en"
                  ? "Add Card"
                  : "添加卡片"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
