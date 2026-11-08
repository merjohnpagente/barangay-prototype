<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use PDO;
use RuntimeException;
use Throwable;

class DatabaseBackupService
{
    private string $directory;

    public function __construct(?string $directory = null)
    {
        $this->directory = $directory ?? storage_path('app/backups');
    }

    public function create(int $keep = 30): string
    {
        $database = $this->databasePath();

        File::ensureDirectoryExists($this->directory);

        DB::statement('PRAGMA wal_checkpoint(TRUNCATE)');

        $path = $this->nextPath();

        if (! File::copy($database, $path)) {
            throw new RuntimeException('Unable to copy the database file.');
        }

        try {
            $this->validateFile($path);
        } catch (Throwable $exception) {
            File::delete($path);

            throw $exception;
        }

        $this->prune($keep);

        return $path;
    }

    /**
     * @return array<int, array{name: string, size: int, modified: string}>
     */
    public function list(): array
    {
        if (! File::isDirectory($this->directory)) {
            return [];
        }

        return collect(File::files($this->directory))
            ->filter(fn ($file): bool => $file->getExtension() === 'sqlite')
            ->map(fn ($file): array => [
                'name' => $file->getFilename(),
                'size' => $file->getSize(),
                'modified' => date('c', $file->getMTime()),
            ])
            ->sortByDesc('modified')
            ->values()
            ->all();
    }

    public function pathFor(string $name): string
    {
        if (basename($name) !== $name || ! preg_match('/^[A-Za-z0-9._-]+\.sqlite$/', $name)) {
            throw new RuntimeException('Invalid backup filename.');
        }

        $path = $this->directory.DIRECTORY_SEPARATOR.$name;

        if (! is_file($path)) {
            throw new RuntimeException('Backup file not found.');
        }

        return $path;
    }

    public function restore(string $source): void
    {
        $this->validateFile($source);

        $database = $this->databasePath();

        $this->create();

        DB::disconnect();
        DB::purge();

        if (! File::copy($source, $database)) {
            throw new RuntimeException('Unable to replace the database file.');
        }

        foreach (['-wal', '-shm'] as $suffix) {
            File::delete($database.$suffix);
        }

        Artisan::call('migrate', ['--force' => true]);
    }

    public function validateFile(string $path): void
    {
        if (! is_file($path)) {
            throw new RuntimeException('Backup file not found.');
        }

        try {
            $pdo = new PDO('sqlite:'.$path);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table'")
                ->fetchAll(PDO::FETCH_COLUMN);

            foreach (['users', 'residents', 'migrations'] as $required) {
                if (! in_array($required, $tables, true)) {
                    throw new RuntimeException("Invalid backup: missing the {$required} table.");
                }
            }

            $check = $pdo->query('PRAGMA integrity_check')->fetchColumn();

            if ($check !== 'ok') {
                throw new RuntimeException('Invalid backup: integrity check failed.');
            }

            $pdo = null;
        } catch (RuntimeException $exception) {
            throw $exception;
        } catch (Throwable) {
            throw new RuntimeException('The file is not a valid SQLite database.');
        }
    }

    public function prune(int $keep = 30): void
    {
        $keep = max(1, $keep);

        $files = collect(File::files($this->directory))
            ->filter(fn ($file): bool => $file->getExtension() === 'sqlite')
            ->sortByDesc(fn ($file): int => $file->getMTime())
            ->values();

        $files->slice($keep)->each(fn ($file) => File::delete($file->getPathname()));
    }

    private function databasePath(): string
    {
        $connection = (string) config('database.default');
        $driver = config("database.connections.{$connection}.driver");
        $path = (string) config("database.connections.{$connection}.database");

        if ($driver !== 'sqlite') {
            throw new RuntimeException('Database backups are only supported for SQLite.');
        }

        if ($path === ':memory:') {
            throw new RuntimeException('The in-memory database cannot be backed up.');
        }

        if (! str_starts_with($path, DIRECTORY_SEPARATOR) && ! preg_match('/^[A-Za-z]:[\\\\\\/]/', $path)) {
            $path = base_path($path);
        }

        if (! is_file($path)) {
            throw new RuntimeException('The SQLite database file was not found.');
        }

        return $path;
    }

    private function nextPath(): string
    {
        $base = 'barangay-'.now()->format('Ymd-His');
        $path = $this->directory.DIRECTORY_SEPARATOR.$base.'.sqlite';
        $suffix = 1;

        while (is_file($path)) {
            $path = $this->directory.DIRECTORY_SEPARATOR.$base.'-'.$suffix.'.sqlite';
            $suffix++;
        }

        return $path;
    }
}
