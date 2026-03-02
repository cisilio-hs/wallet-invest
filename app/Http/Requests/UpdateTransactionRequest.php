<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $transaction = $this->route('transaction');
        return $transaction->wallet->person_id === auth()->user()->person_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_type_id' => ['required', 'integer', 'exists:transaction_types,id'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'traded_at' => ['required', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'transaction_type_id.required' => 'Selecione o tipo de transação.',
            'transaction_type_id.exists' => 'O tipo de transação selecionado é inválido.',
            'quantity.required' => 'A quantidade é obrigatória.',
            'quantity.numeric' => 'A quantidade deve ser um número.',
            'quantity.min' => 'A quantidade deve ser maior ou igual a zero.',
            'unit_price.required' => 'O preço unitário é obrigatório.',
            'unit_price.min' => 'O preço unitário deve ser maior ou igual a zero.',
            'currency.size' => 'A moeda deve ter exatamente 3 caracteres.',
            'traded_at.required' => 'A data da operação é obrigatória.',
            'traded_at.date' => 'A data da operação deve ser uma data válida.',
        ];
    }
}
