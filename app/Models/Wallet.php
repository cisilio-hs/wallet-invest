<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $person_id
 * @property string $name
 * @property bool $is_dirty
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Person $person
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Portfolio> $portfolios
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomAsset> $customAssets
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAllocation> $walletAllocations
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Position> $positions
 */
class Wallet extends Model
{
    /** @use HasFactory<\Database\Factories\WalletFactory> */
    use HasFactory;

    protected $fillable = [
        'person_id',
        'name',
        'is_dirty',
    ];

    protected $casts = [
        'is_dirty' => 'boolean',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Person, $this>
     */
    public function person()
    {
        return $this->belongsTo(Person::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Portfolio, $this>
     */
    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<CustomAsset, $this>
     */
    public function customAssets()
    {
        return $this->hasMany(CustomAsset::class);
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
