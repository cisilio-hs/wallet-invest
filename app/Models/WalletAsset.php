<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int $portfolio_id
 * @property int|null $asset_id
 * @property string|null $custom_name
 * @property int $score
 * @property float $quantity
 * @property float $average_price
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\Portfolio $portfolio
 * @property-read \App\Models\Asset|null $asset
 */
class WalletAsset extends Model
{
    /** @use HasFactory<\Database\Factories\WalletAssetFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'portfolio_id',
        'asset_id',
        'custom_name',
        'score',
        'quantity',
        'average_price',
    ];

    protected $casts = [
        'score' => 'integer',
        'quantity' => 'float',
        'average_price' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Wallet, $this>
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Portfolio, $this>
     */
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Asset, $this>
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * Get display name (ticker for listed, custom_name for unlisted)
     *
     * @return string
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->asset?->ticker ?? $this->custom_name ?? 'Unknown';
    }

    /**
     * Check if this is a listed asset
     *
     * @return bool
     */
    public function getIsListedAttribute(): bool
    {
        return $this->asset_id !== null;
    }

    /**
     * Boot method to add model validation
     */
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function ($walletAsset) {
            // Ensure either asset_id OR custom_name is present, not both
            $hasAssetId = $walletAsset->asset_id !== null;
            $hasCustomName = $walletAsset->custom_name !== null && $walletAsset->custom_name !== '';

            if ($hasAssetId && $hasCustomName) {
                throw new \InvalidArgumentException('Cannot have both asset_id and custom_name. Choose one.');
            }

            if (!$hasAssetId && !$hasCustomName) {
                throw new \InvalidArgumentException('Must provide either asset_id or custom_name.');
            }
        });
    }
}
