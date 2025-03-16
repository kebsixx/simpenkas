<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->decimal('saldo', 15, 2); // Amount of this transaction (positive for income, negative for expense)
            $table->decimal('saldo_akhir', 15, 2); // Running balance after this transaction
            $table->foreignId('penerimaan_id')->nullable()->constrained('penerimaan')->nullOnDelete();
            $table->foreignId('pengeluaran_id')->nullable()->constrained('pengeluaran')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
