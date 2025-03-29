import { FinancialReport } from "@/components/reports/financial-report";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Transaction } from "@/types/database";

async function getTransactionData() {
  const supabase = await createServerSupabaseClient();

  // Get all transactions
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: true });

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
    transactions: transactions as Transaction[],
    totalIncome,
    totalExpense,
    balance,
  };
}

export default async function ReportsPage() {
  const { transactions, totalIncome, totalExpense, balance } =
    await getTransactionData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
      <FinancialReport
        transactions={transactions}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />
    </div>
  );
}
