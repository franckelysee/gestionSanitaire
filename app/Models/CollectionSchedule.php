<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollectionSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'waste_collection_zone_id',
        'scheduled_at',
        'completed_at',
        'assigned_to',
        'status',
        'notes',
        'estimated_duration_minutes',
        'actual_duration_minutes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'estimated_duration_minutes' => 'integer',
        'actual_duration_minutes' => 'integer',
    ];

    /**
     * Get the waste collection zone.
     */
    public function wasteCollectionZone(): BelongsTo
    {
        return $this->belongsTo(WasteCollectionZone::class);
    }

    /**
     * Get the assigned collector.
     */
    public function assignedCollector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Check if schedule is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if schedule is in progress.
     */
    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    /**
     * Check if schedule is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
