<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomAssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $customAsset = $this->route('custom_asset');
        return $customAsset->wallet->person_id === auth()->user()->person_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'asset_type_id' => ['nullable', 'integer', 'exists:asset_types,id'],
            'currency' => ['required', 'string', 'size:3'],
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
            'name.required' => 'O nome do ativo é obrigatório.',
            'currency.required' => 'A moeda é obrigatória.',
            'currency.size' => 'A moeda deve ter exatamente 3 caracteres (ex: BRL, USD).',
        ];
    }
}
