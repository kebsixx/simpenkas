<?php

namespace App\Filament\Widgets;

use App\Models\Penerimaan;
use App\Models\Pengeluaran;
use App\Models\Transaksi;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;
use Illuminate\Support\Str;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // Get total income (penerimaan)
        $totalPenerimaan = Penerimaan::sum('total');

        // Get total expenses (pengeluaran)
        $totalPengeluaran = Pengeluaran::sum('jumlah');

        // Get current balance (saldo kas)
        $currentBalance = Transaksi::latest()->first()?->saldo_akhir ?? 0;

        // Get last 7 penerimaan for chart
        $penerimaanChart = Penerimaan::latest()
            ->take(7)
            ->pluck('total')
            ->toArray();

        // Get last 7 pengeluaran for chart
        $pengeluaranChart = Pengeluaran::latest()
            ->take(7)
            ->pluck('jumlah')
            ->toArray();

        // Get last 7 saldo_akhir values for chart
        $saldoChart = Transaksi::latest()
            ->take(7)
            ->pluck('saldo_akhir')
            ->reverse()
            ->toArray();

        // Format currency values
        $formattedPenerimaan = Str::of(Number::currency($totalPenerimaan, 'IDR', 'id'))->replace(',00', '');
        $formattedPengeluaran = Str::of(Number::currency($totalPengeluaran, 'IDR', 'id'))->replace(',00', '');
        $formattedBalance = Str::of(Number::currency($currentBalance, 'IDR', 'id'))->replace(',00', '');

        return [
            Stat::make('Total Pemasukan', $formattedPenerimaan)
                ->description('Total dari semua penerimaan')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart($penerimaanChart)
                ->color('success'),

            Stat::make('Total Pengeluaran', $formattedPengeluaran)
                ->description('Total dari semua pengeluaran')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->chart($pengeluaranChart)
                ->color('danger'),

            Stat::make('Saldo Kas Saat Ini', $formattedBalance)
                ->description('Saldo akhir terkini')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart($saldoChart)
                ->color('info'),
        ];
    }
}
