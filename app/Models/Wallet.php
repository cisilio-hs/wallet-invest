<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $person_id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 *
 * @property-read \App\Models\Person $person
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Portfolio> $portfolios
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletAsset> $assets
 */
class Wallet extends Model
{
    /** @use HasFactory<\Database\Factories\WalletFactory> */
    use HasFactory;

    protected $fillable = [
        'person_id',
        'name',
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
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<WalletAsset, $this>
     */
    public function assets()
    {
        return $this->hasMany(WalletAsset::class);
    }
}
