<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WasteReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'waste_collection_zone_id',
        'district_id',
        'fill_level',
        'priority',
        'description',
        'photos',
        'coordinates',
        'status',
        'verified_at',
        'verified_by',
        'resolved_at',
        'resolved_by',
        'points_awarded',
    ];

    protected $casts = [
        'photos' => 'array',
        'coordinates' => 'array',
        'verified_at' => 'datetime',
        'resolved_at' => 'datetime',
        'fill_level' => 'decimal:2',
        'points_awarded' => 'integer',
    ];

    /**
     * Get the user who made the report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the waste collection zone.
     */
    public function wasteCollectionZone(): BelongsTo
    {
        return $this->belongsTo(WasteCollectionZone::class);
    }

    /**
     * Get the district.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the user who verified the report.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the user who resolved the report.
     */
    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Get the report actions.
     */
    public function actions(): HasMany
    {
        return $this->hasMany(ReportAction::class);
    }

    /**
     * Check if report is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if report is verified.
     */
    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    /**
     * Check if report is resolved.
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }

    /**
     * Get priority color for UI.
     */
    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'high' => '#ef4444',
            'medium' => '#f59e0b',
            'low' => '#10b981',
            default => '#6b7280'
        };
    }
}
