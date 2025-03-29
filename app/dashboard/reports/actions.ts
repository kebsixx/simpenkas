"use server"

import type { Transaction } from "@/types/database"
import { generateExcelData } from "@/lib/excel-export"
import * as XLSX from "xlsx"

export async function exportToExcel(transactions: Transaction[]) {
  try {
    const { data } = generateExcelData(transactions)

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Tanggal
      { wch: 40 }, // Keterangan
      { wch: 15 }, // Penerimaan
      { wch: 15 }, // Pengeluaran
      { wch: 15 }, // Saldo
    ]
    worksheet["!cols"] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return excelBuffer
  } catch (error) {
    console.error("Error exporting to Excel:", error)
    throw new Error("Failed to export to Excel")
  }
}

