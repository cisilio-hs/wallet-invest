<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int|null $asset_id
 * @property int|null $custom_asset_id
 * @property float $quantity
 * @property float $unit_price
 * @property float $gross_amount
 * @property string $currency
 * @property \Carbon\Carbon $traded_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read string $type
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\Asset|null $asset
 * @property-read \App\Models\CustomAsset|null $customAsset
 */
class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'asset_id',
        'custom_asset_id',
        'quantity',
        'unit_price',
        'gross_amount',
        'currency',
        'traded_at',
    ];

    protected $casts = [
        'quantity' => 'float',
        'unit_price' => 'float',
        'gross_amount' => 'float',
        'traded_at' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Wallet, $this>
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Asset, $this>
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<CustomAsset, $this>
     */
    public function customAsset()
    {
        return $this->belongsTo(CustomAsset::class);
    }

    /**
     * Computed attribute: transaction type (buy or sell)
     */
    public function getTypeAttribute(): string
    {
        return $this->quantity > 0 ? 'buy' : 'sell';
    }
}
