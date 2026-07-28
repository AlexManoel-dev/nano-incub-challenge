<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Informe o nome do funcionário.',
            'name.string' => 'O nome do funcionário deve ser um texto.',
            'name.max' => 'O nome não pode ter mais de 255 caracteres.',
        ];
    }
}