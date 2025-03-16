<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $table = 'pengeluaran';
    protected $fillable = ['tanggal', 'keterangan', 'jumlah'];

    public function transaksi()
    {
        return $this->hasOne(Transaksi::class);
    }

    protected static function booted()
    {
        static::created(function ($pengeluaran) {
            // Get the last transaction to calculate the new saldo_akhir
            $lastTransaction = Transaksi::latest()->first();

            if (!$lastTransaction) {
                // If there's no previous transaction, we can't have a negative balance
                throw new \Exception('Tidak dapat melakukan pengeluaran karena saldo kosong');
            }

            $saldoAkhir = $lastTransaction->saldo_akhir - $pengeluaran->jumlah;

            // Optional: Check if saldo_akhir would be negative
            if ($saldoAkhir < 0) {
                throw new \Exception('Saldo tidak mencukupi untuk pengeluaran ini');
            }

            // Create a new transaction
            Transaksi::create([
                'saldo' => -$pengeluaran->jumlah, // Negative value for expenses
                'saldo_akhir' => $saldoAkhir,
                'penerimaan_id' => null,
                'pengeluaran_id' => $pengeluaran->id,
            ]);
        });
    }
}
