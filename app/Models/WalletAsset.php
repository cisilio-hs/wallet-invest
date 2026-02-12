<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int $portfolio_id
 * @property int $asset_id
 * @property float $quantity
 * @property float $average_price
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\Portfolio $portfolio
 * @property-read \App\Models\Asset $asset
 */
class WalletAsset extends Model
{
    /** @use HasFactory<\Database\Factories\WalletAssetFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'portfolio_id',
        'asset_id',
        'quantity',
        'average_price',
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
}
