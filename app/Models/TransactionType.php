<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $quantity_sign 'positive' | 'negative' | 'neutral'
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $transactions
 */
class TransactionType extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'quantity_sign',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Transaction, $this>
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'transaction_type_id');
    }

    /**
     * Check if this type increases position quantity.
     */
    public function isPositive(): bool
    {
        return $this->quantity_sign === 'positive';
    }

    /**
     * Check if this type decreases position quantity.
     */
    public function isNegative(): bool
    {
        return $this->quantity_sign === 'negative';
    }

    /**
     * Check if this type doesn't affect position quantity.
     */
    public function isNeutral(): bool
    {
        return $this->quantity_sign === 'neutral';
    }

    /**
     * Get the sign multiplier for quantity.
     * Returns 1 for positive, -1 for negative, 0 for neutral.
     */
    public function getQuantityMultiplier(): int
    {
        return match ($this->quantity_sign) {
            'positive' => 1,
            'negative' => -1,
            'neutral' => 0,
            default => 0,
        };
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePositive($query)
    {
        return $query->where('quantity_sign', 'positive');
    }

    public function scopeNegative($query)
    {
        return $query->where('quantity_sign', 'negative');
    }

    public function scopeNeutral($query)
    {
        return $query->where('quantity_sign', 'neutral');
    }
}
