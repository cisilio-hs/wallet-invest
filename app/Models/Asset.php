<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $ticker
 * @property string $name
 * @property int $asset_type_id
 * @property string $market
 * @property string $currency
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \App\Models\AssetType $type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAsset> $walletAssets
 */
class Asset extends Model
{
    protected $fillable = [
        'ticker',
        'name',
        'asset_type_id',
        'market',
        'currency'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<AssetType, $this>
     */
    public function type()
    {
        return $this->belongsTo(AssetType::class, 'asset_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<WalletAsset, $this>
     */
    public function walletAssets()
    {
        return $this->hasMany(WalletAsset::class);
    }
}
