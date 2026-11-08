<?php

namespace App\Http\Requests;

use App\Models\Resident;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'birthday' => ['nullable', 'date'],
            'sex' => ['nullable', 'in:Male,Female'],
            'civil_status' => ['nullable', Rule::in(Resident::CIVIL_STATUSES)],
            'job' => ['nullable', 'string', 'max:255'],
            'purok' => ['nullable', 'string', 'max:255'],
            'pwd' => ['nullable', 'in:Yes,No'],
            'need' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:5000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge([
                'name' => trim(preg_replace('/\s+/', ' ', (string) $this->input('name'))),
            ]);
        }
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $id = $this->route('resident')?->id;

            $duplicate = Resident::query()
                ->whereRaw('LOWER(name) = ?', [mb_strtolower((string) $this->input('name'))])
                ->when($id, fn ($query) => $query->whereKeyNot($id))
                ->exists();

            if ($duplicate) {
                $validator->errors()->add('name', 'A resident with this name already exists.');
            }
        });
    }
}
