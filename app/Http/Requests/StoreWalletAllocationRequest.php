<?php

namespace App\Http\Requests;

use App\Models\Portfolio;
use App\Models\WalletAllocation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWalletAllocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $portfolio = Portfolio::find($this->portfolio_id);
        
        if (!$portfolio) {
            return false;
        }

        return $portfolio->wallet->person_id === auth()->user()->person_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'portfolio_id' => ['required', 'integer', 'exists:portfolios,id'],
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
            'score' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check if asset already exists in this portfolio
            $exists = WalletAllocation::where('portfolio_id', $this->portfolio_id)
                ->where(function ($query) {
                    if ($this->asset_id) {
                        $query->where('asset_id', $this->asset_id);
                    }
                    if ($this->custom_asset_id) {
                        $query->where('custom_asset_id', $this->custom_asset_id);
                    }
                })
                ->exists();

            if ($exists) {
                $validator->errors()->add('asset', 'Este ativo já está alocado nesta carteira.');
            }
        });
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
            'score.min' => 'O score deve ser maior ou igual a 0.',
        ];
    }
}
