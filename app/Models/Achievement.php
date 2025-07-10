<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'badge_color',
        'points_required',
        'condition_type',
        'condition_value',
        'is_active',
    ];

    protected $casts = [
        'points_required' => 'integer',
        'condition_value' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user achievements.
     */
    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class);
    }
}
