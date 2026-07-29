<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                'exists:employees,id',
            ],

            'type' => [
                'required',
                Rule::in(['entry', 'exit']),
            ],

            'amount' => [
                'required',
                'numeric',
                'decimal:0,2',
                'gt:0',
                'max:9999999999.99',
            ],

            'observation' => [
                'required',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Selecione um funcionário.',
            'employee_id.exists' => 'O funcionário selecionado não existe.',

            'type.required' => 'Selecione o tipo da movimentação.',
            'type.in' => 'O tipo da movimentação é inválido.',

            'amount.required' => 'Informe o valor da movimentação.',
            'amount.numeric' => 'O valor deve ser numérico.',
            'amount.decimal' => 'O valor deve possuir no máximo duas casas decimais.',
            'amount.gt' => 'O valor deve ser maior que zero.',
            'amount.max' => 'O valor informado é muito alto.',

            'observation.required' => 'Informe uma observação.',
            'observation.max' => 'A observação deve possuir no máximo 500 caracteres.',
        ];
    }
}