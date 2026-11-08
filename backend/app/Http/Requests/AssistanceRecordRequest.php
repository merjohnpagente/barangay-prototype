<?php

namespace App\Http\Requests;

use App\Models\AssistanceRecord;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssistanceRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'program' => ['required', Rule::in(AssistanceRecord::PROGRAMS)],
            'item' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric', 'min:0', 'max:9999999'],
            'given_at' => ['required', 'date', 'before_or_equal:today'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
