<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property string $name
 * @property float $target_weight
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \App\Models\Wallet $wallet
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAsset> $walletAssets
 */
class Portfolio extends Model
{
    /** @use HasFactory<\Database\Factories\PortfolioFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'name',
        'target_weight',
    ];

    protected $casts = [
        'target_weight' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Wallet, $this>
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<WalletAsset, $this>
     */
    public function walletAssets()
    {
        return $this->hasMany(WalletAsset::class);
    }
}
