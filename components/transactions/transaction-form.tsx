"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import type { Transaction } from "@/types/database"

interface TransactionFormProps {
  type: "income" | "expense"
  initialData?: Transaction
  isEditing?: boolean
}

export function TransactionForm({ type, initialData, isEditing = false }: TransactionFormProps) {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState(initialData?.description || "")
  const [amount, setAmount] = useState(initialData?.amount.toString() || "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const parsedAmount = Number.parseFloat(amount)

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Jumlah harus berupa angka positif")
      }

      if (isEditing && initialData) {
        // Update existing transaction
        const { error } = await supabase
          .from("transactions")
          .update({
            date,
            description,
            amount: parsedAmount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        // Create new transaction
        const { error } = await supabase.from("transactions").insert({
          date,
          description,
          amount: parsedAmount,
          type,
        })

        if (error) throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.")
      console.error("Transaction error:", error)
    } finally {
      setLoading(false)
    }
  }

  const title = isEditing
    ? `Edit ${type === "income" ? "Penerimaan" : "Pengeluaran"}`
    : `Tambah ${type === "income" ? "Penerimaan" : "Pengeluaran"}`

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Keterangan</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === "income" ? "Contoh: Servis motor" : "Contoh: Pembelian oli"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

