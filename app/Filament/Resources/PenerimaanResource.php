<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PenerimaanResource\Pages;
use App\Filament\Resources\PenerimaanResource\RelationManagers;
use App\Models\Penerimaan;
use Filament\Forms;
use Filament\Forms\Form;
use Illuminate\Support\Str;
use Illuminate\Support\Number;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PenerimaanResource extends Resource
{
    protected static ?string $model = Penerimaan::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationGroup = 'Keuangan';
    protected static ?string $navigationLabel = 'Penerimaan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('tgl_penerimaan')
                    ->required()
                    ->label('Tanggal Penerimaan'),
                Forms\Components\TextInput::make('keterangan')
                    ->required()
                    ->label('Keterangan'),
                Forms\Components\TextInput::make('total')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Total'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tgl_penerimaan')
                    ->label('Tanggal Penerimaan')
                    ->sortable()
                    ->date(),
                Tables\Columns\TextColumn::make('keterangan')
                    ->label('Keterangan'),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->formatStateUsing(fn($state) => Str::of(Number::currency($state, 'IDR', 'id'))->replace(',00', '')),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManagePenerimaan::route('/'),
        ];
    }
}
