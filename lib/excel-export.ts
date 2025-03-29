import type { Transaction } from "@/types/database"
import { formatDate } from "@/lib/utils"

export function generateExcelData(transactions: Transaction[]) {
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate running balance for each transaction
  let runningBalance = 0
  const transactionsWithBalance = sortedTransactions.map((transaction) => {
    if (transaction.type === "income") {
      runningBalance += transaction.amount
    } else {
      runningBalance -= transaction.amount
    }

    return {
      Tanggal: formatDate(transaction.date),
      Keterangan: transaction.description,
      Penerimaan: transaction.type === "income" ? transaction.amount : "",
      Pengeluaran: transaction.type === "expense" ? transaction.amount : "",
      Saldo: runningBalance,
    }
  })

  // Calculate totals
  const totalIncome = sortedTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = sortedTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Add summary row
  const summaryRow = {
    Tanggal: "",
    Keterangan: "TOTAL",
    Penerimaan: totalIncome,
    Pengeluaran: totalExpense,
    Saldo: balance,
  }

  return {
    data: [...transactionsWithBalance, summaryRow],
    totalIncome,
    totalExpense,
    balance,
  }
}

