import { TransactionForm } from "@/components/transactions/transaction-form"

export default function AddExpensePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tambah Pengeluaran</h1>
      <TransactionForm type="expense" />
    </div>
  )
}

