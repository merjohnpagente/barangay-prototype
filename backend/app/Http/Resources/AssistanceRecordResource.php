<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssistanceRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'program' => $this->program,
            'item' => $this->item,
            'amount' => $this->amount,
            'given_at' => $this->given_at?->format('Y-m-d'),
            'remarks' => $this->remarks,
            'encoded_by' => $this->user?->name ?? 'System Admin',
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
