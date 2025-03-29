"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/types/database"
import { FileDown, Printer } from "lucide-react"
import { exportToExcel } from "@/app/dashboard/reports/actions"

interface FinancialReportProps {
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  balance: number
}

export function FinancialReport({ transactions, totalIncome, totalExpense, balance }: FinancialReportProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const filteredTransactions = transactions.filter((transaction) => {
    if (!startDate && !endDate) return true

    const transactionDate = new Date(transaction.date)
    const start = startDate ? new Date(startDate) : new Date(0)
    const end = endDate ? new Date(endDate) : new Date(8640000000000000)

    return transactionDate >= start && transactionDate <= end
  })

  const filteredIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const filteredExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const filteredBalance = filteredIncome - filteredExpense

  const handlePrint = () => {
    window.print()
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Call the server action to generate Excel file
      const excelBuffer = await exportToExcel(filteredTransactions)

      // Create a Blob from the buffer
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split("T")[0]
      link.download = `Laporan_Keuangan_${dateStr}.xlsx`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Gagal mengekspor ke Excel. Silakan coba lagi.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="endDate">Tanggal Akhir</Label>
          <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? "Mengekspor..." : "Export Excel"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Penerimaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(filteredIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(filteredExpense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(filteredBalance)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Penerimaan</TableHead>
              <TableHead>Pengeluaran</TableHead>
              <TableHead>Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Tidak ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((transaction, index, array) => {
                  // Calculate running balance
                  let runningBalance = 0
                  for (let i = 0; i <= index; i++) {
                    if (array[i].type === "income") {
                      runningBalance += array[i].amount
                    } else {
                      runningBalance -= array[i].amount
                    }
                  }

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.type === "income" ? formatCurrency(transaction.amount) : "-"}</TableCell>
                      <TableCell>{transaction.type === "expense" ? formatCurrency(transaction.amount) : "-"}</TableCell>
                      <TableCell>{formatCurrency(runningBalance)}</TableCell>
                    </TableRow>
                  )
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

