import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types/database";
import { revalidatePath } from "next/cache";

async function getTransactionData() {
  const supabase = await createServerSupabaseClient();

  // Get all transactions
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching transactions:", error);
    return {
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
  };
}

async function deleteTransaction(id: string) {
  "use server";

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }

  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const { transactions, totalIncome, totalExpense, balance } =
    await getTransactionData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Penerimaan"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpIcon className="h-4 w-4 text-green-600" />}
          className="border-green-100"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={formatCurrency(totalExpense)}
          icon={<ArrowDownIcon className="h-4 w-4 text-red-600" />}
          className="border-red-100"
        />
        <SummaryCard
          title="Saldo Kas"
          value={formatCurrency(balance)}
          icon={<WalletIcon className="h-4 w-4 text-blue-600" />}
          className="border-blue-100"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
        <RecentTransactions
          transactions={transactions as Transaction[]}
          deleteTransactionAction={deleteTransaction}
        />
      </div>
    </div>
  );
}
