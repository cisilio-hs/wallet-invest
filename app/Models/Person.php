<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $phone
 * @property string|null $birthday
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Wallet> $wallets
 */
class Person extends Model
{
    /** @use HasFactory<\Database\Factories\PersonFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'birthday',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<User, $this>
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Wallet, $this>
     */
    public function wallets()
    {
        return $this->hasMany(Wallet::class);
    }
}
