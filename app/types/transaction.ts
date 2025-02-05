export type TransactionCategory = "Shopping" | "Restaurants" | "Transport" | "Entertainment"

export interface Transaction {
  id: string
  name: string
  amount: number
  type: "income" | "expense"
  date: string
  description?: string
  category: TransactionCategory
}
