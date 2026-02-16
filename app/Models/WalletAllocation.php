<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int $portfolio_id
 * @property int|null $asset_id
 * @property int|null $custom_asset_id
 * @property int $score
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\Portfolio $portfolio
 * @property-read \App\Models\Asset|null $asset
 * @property-read \App\Models\CustomAsset|null $customAsset
 */
class WalletAllocation extends Model
{
    /** @use HasFactory<\Database\Factories\WalletAllocationFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'portfolio_id',
        'asset_id',
        'custom_asset_id',
        'score',
    ];

    protected $casts = [
        'score' => 'integer',
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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<CustomAsset, $this>
     */
    public function customAsset()
    {
        return $this->belongsTo(CustomAsset::class);
    }
}
