<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Asset> $assets
 */
class AssetType extends Model
{
    protected $fillable = ['name', 'slug'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Asset, $this>
     */
    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}
