<?php

namespace App\Http\Requests;

use App\Models\Wallet;
use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $wallet = Wallet::find($this->wallet_id);
        
        if (!$wallet) {
            return false;
        }

        return $wallet->person_id === auth()->user()->person_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'transaction_type_id' => ['required', 'integer', 'exists:transaction_types,id'],
            'asset_id' => [
                'nullable',
                'integer',
                'exists:assets,id',
                'required_without:custom_asset_id',
            ],
            'custom_asset_id' => [
                'nullable',
                'integer',
                'exists:custom_assets,id',
                'required_without:asset_id',
            ],
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
            'asset_id.required_without' => 'Selecione um ativo listado ou um ativo customizado.',
            'custom_asset_id.required_without' => 'Selecione um ativo listado ou um ativo customizado.',
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
