<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteCollectionZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'district_id',
        'coordinates',
        'radius_meters',
        'capacity_liters',
        'current_fill_level',
        'last_emptied_at',
        'next_collection_at',
        'priority_level',
        'zone_type',
        'is_active',
        'sensor_id',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'capacity_liters' => 'integer',
        'current_fill_level' => 'decimal:2',
        'last_emptied_at' => 'datetime',
        'next_collection_at' => 'datetime',
        'is_active' => 'boolean',
        'radius_meters' => 'integer',
    ];

    /**
     * Get the district that this zone belongs to.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the waste reports for this zone.
     */
    public function wasteReports(): HasMany
    {
        return $this->hasMany(WasteReport::class);
    }

    /**
     * Get the collection schedules for this zone.
     */
    public function collectionSchedules(): HasMany
    {
        return $this->hasMany(CollectionSchedule::class);
    }

    /**
     * Get the fill level percentage.
     */
    public function getFillPercentageAttribute(): float
    {
        if ($this->capacity_liters <= 0) {
            return 0;
        }
        
        return min(100, ($this->current_fill_level / $this->capacity_liters) * 100);
    }

    /**
     * Check if zone needs urgent collection.
     */
    public function needsUrgentCollection(): bool
    {
        return $this->fill_percentage >= 90 || $this->priority_level === 'high';
    }

    /**
     * Get priority color for UI.
     */
    public function getPriorityColorAttribute(): string
    {
        return match($this->priority_level) {
            'high' => '#ef4444',
            'medium' => '#f59e0b',
            'low' => '#10b981',
            default => '#6b7280'
        };
    }
}
