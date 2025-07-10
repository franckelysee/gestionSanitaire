<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class District extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city_id',
        'coordinates',
        'population',
        'area_km2',
        'is_active',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'is_active' => 'boolean',
        'population' => 'integer',
        'area_km2' => 'decimal:2',
    ];

    /**
     * Get the city that the district belongs to.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Get the waste collection zones in this district.
     */
    public function wasteZones(): HasMany
    {
        return $this->hasMany(WasteCollectionZone::class);
    }

    /**
     * Get the users in this district.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the waste reports in this district.
     */
    public function wasteReports(): HasMany
    {
        return $this->hasMany(WasteReport::class);
    }
}
