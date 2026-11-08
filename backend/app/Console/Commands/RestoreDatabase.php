<?php

namespace App\Console\Commands;

use App\Services\DatabaseBackupService;
use Illuminate\Console\Command;
use Throwable;

class RestoreDatabase extends Command
{
    protected $signature = 'db:restore {file : Path to a .sqlite backup or filename inside storage/app/backups}';

    protected $description = 'Restore the SQLite database from a backup';

    public function handle(DatabaseBackupService $backups): int
    {
        $file = (string) $this->argument('file');
        $path = is_file($file) ? $file : storage_path('app/backups'.DIRECTORY_SEPARATOR.basename($file));

        try {
            $backups->restore($path);
        } catch (Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info('Database restored from: '.$path);

        return self::SUCCESS;
    }
}
