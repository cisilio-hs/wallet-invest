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
 * @property float|null $minimum_order_quantity
 * @property float|null $minimum_order_value
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\AssetType $type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAllocation> $walletAllocations
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Position> $positions
 */
class Asset extends Model
{
    protected $fillable = [
        'ticker',
        'name',
        'asset_type_id',
        'market',
        'currency',
        'minimum_order_quantity',
        'minimum_order_value',
    ];

    protected $casts = [
        'minimum_order_quantity' => 'float',
        'minimum_order_value' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<AssetType, $this>
     */
    public function type()
    {
        return $this->belongsTo(AssetType::class, 'asset_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<WalletAllocation, $this>
     */
    public function walletAllocations()
    {
        return $this->hasMany(WalletAllocation::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Transaction, $this>
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Position, $this>
     */
    public function positions()
    {
        return $this->hasMany(Position::class);
    }
}
