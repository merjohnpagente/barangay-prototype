<?php

namespace Tests\Feature;

use App\Models\Resident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AssistanceRecordApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        Sanctum::actingAs(User::query()->firstOrFail());
    }

    public function test_recording_assistance_marks_resident_given_and_returns_history(): void
    {
        $resident = Resident::query()->where('assistance', 'Pending')->firstOrFail();

        $this->postJson("/api/residents/{$resident->id}/assistance-records", [
            'program' => 'Food Pack',
            'item' => 'Rice 5kg and canned goods',
            'amount' => 250,
            'given_at' => now()->toDateString(),
            'remarks' => 'Distributed at the barangay hall.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.program', 'Food Pack')
            ->assertJsonPath('data.encoded_by', 'System Admin');

        $this->assertSame('Given', $resident->refresh()->assistance);

        $this->getJson("/api/residents/{$resident->id}/assistance-records")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.item', 'Rice 5kg and canned goods');
    }

    public function test_recording_assistance_validates_program_and_date(): void
    {
        $resident = Resident::query()->firstOrFail();

        $this->postJson("/api/residents/{$resident->id}/assistance-records", [
            'program' => 'Not a program',
            'given_at' => now()->addDay()->toDateString(),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['program', 'given_at']);
    }

    public function test_deleting_the_last_record_marks_resident_pending(): void
    {
        $resident = Resident::query()->where('assistance', 'Pending')->firstOrFail();

        $record = $this->postJson("/api/residents/{$resident->id}/assistance-records", [
            'program' => 'Medical',
            'given_at' => now()->toDateString(),
        ])->json('data');

        $this->deleteJson("/api/residents/{$resident->id}/assistance-records/{$record['id']}")
            ->assertOk();

        $this->assertSame('Pending', $resident->refresh()->assistance);
        $this->assertDatabaseCount('assistance_records', 0);
    }

    public function test_record_cannot_be_deleted_through_a_different_resident(): void
    {
        $first = Resident::query()->firstOrFail();
        $second = Resident::query()->whereKeyNot($first->id)->firstOrFail();

        $record = $this->postJson("/api/residents/{$first->id}/assistance-records", [
            'program' => 'Cash Aid',
            'given_at' => now()->toDateString(),
        ])->json('data');

        $this->deleteJson("/api/residents/{$second->id}/assistance-records/{$record['id']}")
            ->assertNotFound();
    }
}
