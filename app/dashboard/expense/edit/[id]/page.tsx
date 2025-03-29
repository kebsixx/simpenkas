import { TransactionForm } from "@/components/transactions/transaction-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

async function getTransaction(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("type", "expense")
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditExpensePage({ params }: PageProps) {
  const transaction = await getTransaction(params.id);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Pengeluaran</h1>
      <TransactionForm
        type="expense"
        initialData={transaction}
        isEditing={true}
      />
    </div>
  );
}
