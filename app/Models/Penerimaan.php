<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penerimaan extends Model
{
    protected $table = 'penerimaan';
    protected $fillable = ['tgl_penerimaan', 'keterangan', 'total'];

    public function transaksi()
    {
        return $this->hasOne(Transaksi::class);
    }

    protected static function booted()
    {
        static::created(function ($penerimaan) {
            // Get the last transaction to calculate the new saldo_akhir
            $lastTransaction = Transaksi::latest()->first();
            $saldoAkhir = $lastTransaction ? $lastTransaction->saldo_akhir + $penerimaan->total : $penerimaan->total;

            // Create a new transaction
            Transaksi::create([
                'saldo' => $penerimaan->total,
                'saldo_akhir' => $saldoAkhir,
                'penerimaan_id' => $penerimaan->id,
                'pengeluaran_id' => null,
            ]);
        });

        static::updated(function ($penerimaan) {
            $transaction = Transaksi::where('penerimaan_id', $penerimaan->id)->first();
            if ($transaction) {
                // Calculate the difference
                $difference = $penerimaan->total - $transaction->saldo;

                // Update this transaction
                $transaction->saldo = $penerimaan->total;
                $transaction->saldo_akhir = $transaction->saldo_akhir + $difference;
                $transaction->save();

                // Update all subsequent transactions
                $laterTransactions = Transaksi::where('id', '>', $transaction->id)->get();
                foreach ($laterTransactions as $laterTransaction) {
                    $laterTransaction->saldo_akhir += $difference;
                    $laterTransaction->save();
                }
            }
        });

        static::deleted(function ($penerimaan) {
            $transaction = Transaksi::where('penerimaan_id', $penerimaan->id)->first();
            if ($transaction) {
                $amount = $transaction->saldo;

                // Update all subsequent transactions
                $laterTransactions = Transaksi::where('id', '>', $transaction->id)->get();
                foreach ($laterTransactions as $laterTransaction) {
                    $laterTransaction->saldo_akhir -= $amount;
                    $laterTransaction->save();
                }

                // Delete this transaction
                $transaction->delete();
            }
        });
    }
}
