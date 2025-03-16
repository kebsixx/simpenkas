<?php

namespace App\Filament\Resources\PengeluaranResource\Pages;

use App\Filament\Resources\PengeluaranResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManagePengeluaran extends ManageRecords
{
    protected static string $resource = PengeluaranResource::class;

    protected static ?string $slug = 'pengeluaran';
    protected static ?string $title = 'Pengeluaran';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
