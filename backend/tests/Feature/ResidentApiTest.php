<?php

namespace Tests\Feature;

use App\Models\Resident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResidentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        Sanctum::actingAs(User::query()->firstOrFail());
    }

    public function test_login_returns_a_token(): void
    {
        $this->postJson('/api/login', [
            'email' => 'admin@barangay.test',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['name', 'email']]);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->postJson('/api/login', [
            'email' => 'admin@barangay.test',
            'password' => 'wrong',
        ])->assertUnprocessable();
    }

    public function test_residents_index_returns_ten_seeded_residents(): void
    {
        $this->getJson('/api/residents')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.code', 'R-001')
            ->assertJsonPath('data.0.civil_status', 'Married')
            ->assertJsonPath('data.9.code', 'R-010')
            ->assertJsonPath('meta.total', 10);
    }

    public function test_search_matches_name_or_id(): void
    {
        $this->getJson('/api/residents?search=R-003')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Garcia, Ana Lopez');
    }

    public function test_creating_a_resident_increments_the_id(): void
    {
        $this->postJson('/api/residents', [
            'name' => 'New, Resident One',
            'age' => 30,
            'civil_status' => 'Married',
            'purok' => 'Purok 1',
            'pwd' => 'No',
        ])
            ->assertCreated()
            ->assertJsonPath('data.code', 'R-011')
            ->assertJsonPath('data.name', 'New, Resident One')
            ->assertJsonPath('data.civil_status', 'Married');

        $this->assertDatabaseCount('residents', 11);
    }

    public function test_duplicate_names_are_rejected_case_insensitively(): void
    {
        $this->postJson('/api/residents', [
            'name' => 'santos,   maria cruz',
            'age' => 30,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_resident_can_be_updated_without_duplicate_flag(): void
    {
        $resident = Resident::query()->where('name', 'Santos, Maria Cruz')->firstOrFail();

        $this->putJson("/api/residents/{$resident->id}", [
            'name' => 'Santos, Maria Cruz',
            'age' => 35,
            'civil_status' => 'Widowed',
            'purok' => 'Purok 1',
            'pwd' => 'Yes',
        ])
            ->assertOk()
            ->assertJsonPath('data.age', 35)
            ->assertJsonPath('data.civil_status', 'Widowed');
    }

    public function test_civil_status_must_be_a_valid_option(): void
    {
        $this->postJson('/api/residents', [
            'name' => 'Invalid Status, Resident',
            'civil_status' => 'Complicated',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('civil_status');
    }

    public function test_residents_can_be_filtered_by_civil_status(): void
    {
        $this->getJson('/api/residents?filter=Married')
            ->assertOk()
            ->assertJsonPath('meta.total', 4)
            ->assertJsonPath('data.0.civil_status', 'Married');
    }

    public function test_assistance_status_can_be_toggled(): void
    {
        $resident = Resident::query()->where('assistance', 'Pending')->firstOrFail();

        $this->patchJson("/api/residents/{$resident->id}/assistance")
            ->assertOk()
            ->assertJsonPath('data.assistance', 'Given');
    }

    public function test_dashboard_returns_summary_and_lists(): void
    {
        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('summary.total', 10)
            ->assertJsonCount(5, 'recent')
            ->assertJsonPath('summary.assisted', 5);
    }

    public function test_reports_return_purok_breakdown(): void
    {
        $this->getJson('/api/reports')
            ->assertOk()
            ->assertJsonCount(5, 'puroks')
            ->assertJsonPath('summary.total', 10);
    }

    public function test_residents_can_be_exported_as_csv(): void
    {
        $response = $this->get('/api/residents/export');

        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('content-type'));
        $this->assertStringContainsString('R-001', $response->streamedContent());
    }
}
