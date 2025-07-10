<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'coordinates',
        'timezone',
        'population',
        'is_active',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'is_active' => 'boolean',
        'population' => 'integer',
    ];

    /**
     * Get the districts in this city.
     */
    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }
}
