<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'age' => $this->currentAge(),
            'birthday' => $this->birthday?->format('Y-m-d'),
            'sex' => $this->sex,
            'civil_status' => $this->civil_status,
            'job' => $this->job,
            'purok' => $this->purok,
            'pwd' => $this->pwd ? 'Yes' : 'No',
            'assistance' => $this->assistance,
            'need' => $this->need,
            'remarks' => $this->remarks,
        ];
    }
}
