"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react" // Added import for React

interface WalletLayoutProps {
  children: React.ReactNode
  className?: string
}

export function WalletLayout({ children, className }: WalletLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full max-w-md mx-auto bg-background rounded-[2rem] shadow-lg p-6 space-y-6", className)}
    >
      {children}
    </motion.div>
  )
}
