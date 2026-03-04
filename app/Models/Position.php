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
 * @property float $average_price
 * @property bool $is_dirty
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\Asset|null $asset
 * @property-read \App\Models\CustomAsset|null $customAsset
 */
class Position extends Model
{
    /** @use HasFactory<\Database\Factories\PositionFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'asset_id',
        'custom_asset_id',
        'quantity',
        'average_price',
        'is_dirty',
    ];

    protected $casts = [
        'quantity' => 'float',
        'average_price' => 'float',
        'is_dirty' => 'boolean',
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
     * Scope to eager load asset relationship.
     */
    public function scopeWithAsset($query)
    {
        return $query->with(['asset', 'customAsset']);
    }

    /**
     * Scope to filter positions that need recalculation.
     */
    public function scopeDirty($query)
    {
        return $query->where('is_dirty', true);
    }

    /**
     * Scope to filter positions with quantity > 0 or dirty (new positions).
     * Shows positions with qty=0 only if dirty (not yet synchronized).
     */
    public function scopeHasQuantity($query)
    {
        return $query->where(function ($q) {
            $q->where('quantity', '>', 0)
                ->orWhere(function ($q2) {
                    $q2->where('quantity', '<=', 0)
                        ->where('is_dirty', true);
                });
        });
    }
}
