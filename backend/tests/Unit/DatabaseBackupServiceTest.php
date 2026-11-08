<?php

namespace Tests\Unit;

use App\Services\DatabaseBackupService;
use PDO;
use RuntimeException;
use Tests\TestCase;

class DatabaseBackupServiceTest extends TestCase
{
    public function test_valid_sqlite_file_is_accepted(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'backup-test-');

        $pdo = new PDO('sqlite:'.$path);
        $pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY)');
        $pdo->exec('CREATE TABLE residents (id INTEGER PRIMARY KEY)');
        $pdo->exec('CREATE TABLE migrations (id INTEGER PRIMARY KEY)');
        $pdo = null;

        (new DatabaseBackupService(sys_get_temp_dir()))->validateFile($path);

        unlink($path);

        $this->assertTrue(true);
    }

    public function test_non_sqlite_file_is_rejected(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'backup-test-');
        file_put_contents($path, 'not a database');

        $this->expectException(RuntimeException::class);

        try {
            (new DatabaseBackupService(sys_get_temp_dir()))->validateFile($path);
        } finally {
            unlink($path);
        }
    }

    public function test_sqlite_file_without_required_tables_is_rejected(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'backup-test-');

        $pdo = new PDO('sqlite:'.$path);
        $pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY)');
        $pdo = null;

        $this->expectException(RuntimeException::class);

        try {
            (new DatabaseBackupService(sys_get_temp_dir()))->validateFile($path);
        } finally {
            unlink($path);
        }
    }
}
