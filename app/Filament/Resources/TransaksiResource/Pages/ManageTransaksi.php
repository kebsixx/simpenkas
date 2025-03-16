<?php

namespace App\Filament\Resources\TransaksiResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use App\Filament\Resources\TransaksiResource;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
use pxlrbt\FilamentExcel\Actions\Pages\ExportAction;

class ManageTransaksi extends ManageRecords
{
    protected static string $resource = TransaksiResource::class;

    protected static ?string $slug = 'transaksi';
    protected static ?string $title = 'Transaksi';

    protected function getHeaderActions(): array
    {
        return [
            ExportAction::make()->exports([
                ExcelExport::make('table')->fromTable()->askForFilename()->askForWriterType()
            ]),
            Actions\CreateAction::make()
        ];
    }
}
