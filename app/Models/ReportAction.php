<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'waste_report_id',
        'user_id',
        'action_type',
        'description',
        'data',
        'performed_at',
    ];

    protected $casts = [
        'data' => 'array',
        'performed_at' => 'datetime',
    ];

    /**
     * Get the waste report.
     */
    public function wasteReport(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class);
    }

    /**
     * Get the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
