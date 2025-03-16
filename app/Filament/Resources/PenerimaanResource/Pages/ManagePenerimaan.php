<?php

namespace App\Filament\Resources\PenerimaanResource\Pages;

use App\Filament\Resources\PenerimaanResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManagePenerimaan extends ManageRecords
{
    protected static string $resource = PenerimaanResource::class;

    protected static ?string $slug = 'penerimaan';
    protected static ?string $title = 'Penerimaan';

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
