import { TransactionForm } from "@/components/transactions/transaction-form"

export default function AddIncomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tambah Penerimaan</h1>
      <TransactionForm type="income" />
    </div>
  )
}

