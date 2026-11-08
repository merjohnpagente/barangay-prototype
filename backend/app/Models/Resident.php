<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    public const CIVIL_STATUSES = ['Single', 'Married', 'Widowed', 'Separated', 'Annulled'];

    protected $fillable = [
        'code',
        'name',
        'age',
        'birthday',
        'age_year',
        'sex',
        'civil_status',
        'job',
        'purok',
        'pwd',
        'assistance',
        'need',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'birthday' => 'date',
            'age' => 'integer',
            'age_year' => 'integer',
            'pwd' => 'boolean',
        ];
    }

    public function currentAge(): ?int
    {
        if ($this->birthday) {
            $age = (int) $this->birthday->diffInYears(now());

            return $age >= 0 ? $age : null;
        }

        if ($this->age === null) {
            return null;
        }

        return $this->age + max(0, now()->year - ($this->age_year ?? now()->year));
    }

    public static function nextCode(): string
    {
        $max = static::query()
            ->pluck('code')
            ->map(fn (string $code): int => (int) preg_replace('/\D/', '', $code))
            ->max() ?? 0;

        return 'R-'.str_pad((string) ($max + 1), 3, '0', STR_PAD_LEFT);
    }
}
