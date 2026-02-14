<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWalletAssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'portfolio_id' => ['required', 'exists:portfolios,id'],
            'asset_id' => [
                'nullable',
                'exists:assets,id',
                function ($attribute, $value, $fail) {
                    if ($value !== null && $this->filled('custom_name')) {
                        $fail('Cannot provide both asset_id and custom_name. Choose one.');
                    }
                    
                    if ($value !== null) {
                        $walletId = $this->user()->person->wallets()->first()?->id;
                        if ($walletId) {
                            $exists = \App\Models\WalletAsset::where('wallet_id', $walletId)
                                ->where('asset_id', $value)
                                ->whereNull('custom_name')
                                ->exists();
                            
                            if ($exists) {
                                $fail('This asset is already in your wallet.');
                            }
                        }
                    }
                },
            ],
            'custom_name' => [
                'nullable',
                'string',
                'max:255',
                'required_without:asset_id',
                function ($attribute, $value, $fail) {
                    if (!empty($value) && $this->filled('asset_id')) {
                        $fail('Cannot provide both asset_id and custom_name. Choose one.');
                    }
                    
                    if (!empty($value)) {
                        $walletId = $this->user()->person->wallets()->first()?->id;
                        if ($walletId) {
                            $exists = \App\Models\WalletAsset::where('wallet_id', $walletId)
                                ->whereNull('asset_id')
                                ->where('custom_name', $value)
                                ->exists();
                            
                            if ($exists) {
                                $fail('An unlisted asset with this name already exists in your wallet.');
                            }
                        }
                    }
                },
            ],
            'score' => ['required', 'integer', 'min:0', 'max:4294967295'],
            'quantity' => ['required', 'numeric', 'min:0.0000000001'],
            'average_price' => ['required', 'numeric', 'min:0'],
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
            'custom_name.required_without' => 'You must provide either an asset or a custom name for unlisted assets.',
        ];
    }
}
