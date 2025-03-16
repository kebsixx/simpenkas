<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use App\Models\Transaksi;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Support\Number;
use Filament\Resources\Resource;
use Filament\Tables\Filters\Filter;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
use App\Filament\Resources\PenerimaanResource;
use App\Filament\Resources\PengeluaranResource;
use App\Filament\Resources\TransaksiResource\Pages;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;

class TransaksiResource extends Resource
{
    protected static ?string $model = Transaksi::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Keuangan';
    protected static ?string $navigationLabel = 'Transaksi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DateTimePicker::make('created_at')
                    ->label('Tanggal')
                    ->disabled(),
                Forms\Components\TextInput::make('saldo')
                    ->label('Nominal')
                    ->prefix('Rp')
                    ->disabled(),
                Forms\Components\TextInput::make('saldo_akhir')
                    ->label('Saldo Akhir')
                    ->prefix('Rp')
                    ->disabled(),
                Forms\Components\Placeholder::make('penerimaan_info')
                    ->label('Info Penerimaan')
                    ->content(fn(Transaksi $record) => $record->penerimaan ? $record->penerimaan->keterangan : 'Tidak ada penerimaan terkait'),
                Forms\Components\Placeholder::make('pengeluaran_info')
                    ->label('Info Pengeluaran')
                    ->content(fn(Transaksi $record) => $record->pengeluaran ? $record->pengeluaran->keterangan : 'Tidak ada pengeluaran terkait'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
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
            ->filters([
                Tables\Filters\Filter::make('penerimaan')
                    ->label('Hanya Penerimaan')
                    ->query(fn($query) => $query->whereNotNull('penerimaan_id')),
                Tables\Filters\Filter::make('pengeluaran')
                    ->label('Hanya Pengeluaran')
                    ->query(fn($query) => $query->whereNotNull('pengeluaran_id')),
                Tables\Filters\Filter::make('created_at')
                    ->label('Rentang Tanggal'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
            ->bulkActions([
                ExportBulkAction::make()
                    ->label('Export ke Excel')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('success')
                    ->exports([
                        ExcelExport::make('table')->fromTable()->withFilename(fn($resource) => $resource::getLabel())
                    ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageTransaksi::route('/'),
        ];
    }
}
