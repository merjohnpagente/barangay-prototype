<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BackupApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        Sanctum::actingAs(User::query()->firstOrFail());
    }

    public function test_backup_list_is_returned(): void
    {
        $this->getJson('/api/backups')
            ->assertOk()
            ->assertJsonStructure(['backups']);
    }

    public function test_in_memory_database_cannot_be_backed_up(): void
    {
        $this->postJson('/api/backups')
            ->assertStatus(422)
            ->assertJsonPath('message', 'The in-memory database cannot be backed up.');
    }

    public function test_invalid_backup_upload_is_rejected(): void
    {
        $file = UploadedFile::fake()->createWithContent('invalid.sqlite', 'this is not a database');

        $this->post('/api/backups/restore', ['backup' => $file], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonStructure(['message']);
    }
}
