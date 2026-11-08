<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssistanceRecord extends Model
{
    use HasFactory;

    public const PROGRAMS = ['Food Pack', 'Medical', 'Cash Aid', 'Livelihood', 'Other'];

    protected $fillable = [
        'resident_id',
        'user_id',
        'program',
        'item',
        'amount',
        'given_at',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'given_at' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
