<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $fillable = ['saldo', 'saldo_akhir', 'penerimaan_id', 'pengeluaran_id'];

    public function penerimaan()
    {
        return $this->belongsTo(Penerimaan::class);
    }

    public function pengeluaran()
    {
        return $this->belongsTo(Pengeluaran::class);
    }
}
