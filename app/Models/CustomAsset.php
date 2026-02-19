<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int|null $asset_type_id
 * @property string $name
 * @property string $currency
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Wallet $wallet
 * @property-read \App\Models\AssetType|null $type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAllocation> $walletAllocations
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Position> $positions
 */
class CustomAsset extends Model
{
    /** @use HasFactory<\Database\Factories\CustomAssetFactory> */
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'asset_type_id',
        'name',
        'currency',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Wallet, $this>
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<AssetType, $this>
     */
    public function type()
    {
        return $this->belongsTo(AssetType::class);
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
