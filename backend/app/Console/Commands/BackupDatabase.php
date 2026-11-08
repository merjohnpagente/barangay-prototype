<?php

namespace App\Console\Commands;

use App\Services\DatabaseBackupService;
use Illuminate\Console\Command;
use Throwable;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup {--keep=30 : Number of backups to keep}';

    protected $description = 'Create a backup of the SQLite database';

    public function handle(DatabaseBackupService $backups): int
    {
        try {
            $path = $backups->create((int) $this->option('keep'));
        } catch (Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info('Backup created: '.$path);

        return self::SUCCESS;
    }
}
