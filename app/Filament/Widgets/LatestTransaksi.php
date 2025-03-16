<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use App\Models\Transaksi;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Support\Number;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
use App\Filament\Resources\PenerimaanResource;
use App\Filament\Resources\PengeluaranResource;
use Filament\Widgets\TableWidget as BaseWidget;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;

class LatestTransaksi extends BaseWidget
{
    protected static ?int $sort = 2; // Position after KasOverview widget
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Transaksi Terbaru';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Transaksi::query()
                    ->with(['penerimaan', 'pengeluaran'])
                    ->latest()
                    ->limit(15)
            )
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('penerimaan.keterangan')
                    ->label('Penerimaan')
                    ->placeholder('-')
                    ->searchable(),

                Tables\Columns\TextColumn::make('pengeluaran.keterangan')
                    ->label('Pengeluaran')
                    ->placeholder('-')
                    ->searchable(),

                Tables\Columns\TextColumn::make('saldo')
                    ->label('Nominal')
                    ->formatStateUsing(fn($state) => Str::of(Number::currency($state, 'IDR', 'id'))->replace(',00', ''))
                    ->color(fn($record) => $record->saldo >= 0 ? 'success' : 'danger')
                    ->searchable(),

                Tables\Columns\TextColumn::make('saldo_akhir')
                    ->label('Saldo Akhir')
                    ->formatStateUsing(fn($state) => Str::of(Number::currency($state, 'IDR', 'id'))->replace(',00', ''))
                    ->color('info')
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\Action::make('edit_source')
                    ->label('Edit Sumber')
                    ->icon('heroicon-o-pencil')
                    ->color('warning')
                    ->url(function (Transaksi $record): string {
                        if ($record->penerimaan_id) {
                            return PenerimaanResource::getUrl('index', ['record' => $record->penerimaan_id, 'openEditModal' => 'true']);
                        } elseif ($record->pengeluaran_id) {
                            return PengeluaranResource::getUrl('index', ['record' => $record->pengeluaran_id, 'openEditModal' => 'true']);
                        }
                        return '#';
                    }),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalDescription('Menghapus transaksi ini juga akan memperbarui saldo akhir pada semua transaksi berikutnya. Transaksi ini akan dihapus, tetapi catatan penerimaan atau pengeluaran terkait tidak akan dihapus.')
                    ->action(function (Transaksi $record) {
                        $amount = $record->saldo;

                        // Update all subsequent transactions
                        $laterTransactions = Transaksi::where('id', '>', $record->id)->get();
                        foreach ($laterTransactions as $laterTransaction) {
                            $laterTransaction->saldo_akhir -= $amount;
                            $laterTransaction->save();
                        }

                        // Delete this transaction
                        $record->delete();
                    }),
            ])
            ->filters([
                // You can add filters here if needed
            ])
            ->bulkActions([
                ExportBulkAction::make()
                    ->label('Export ke Excel')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('success')
                    ->exports([
                        ExcelExport::make('table')->fromTable()->withFilename(fn($resource) => $resource::getLabel())
                    ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated(true);
    }
}
