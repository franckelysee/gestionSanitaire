<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'name' => '🌱 Premier Pas',
                'description' => 'Effectuer votre premier signalement de poubelle',
                'icon' => 'leaf',
                'badge_color' => '#10b981',
                'points_required' => 10,
                'condition_type' => 'reports_count',
                'condition_value' => 1,
                'is_active' => true,
            ],
            [
                'name' => '🔥 Citoyen Actif',
                'description' => 'Effectuer 10 signalements validés',
                'icon' => 'fire',
                'badge_color' => '#f59e0b',
                'points_required' => 100,
                'condition_type' => 'reports_count',
                'condition_value' => 10,
                'is_active' => true,
            ],
            [
                'name' => '⭐ Éco-Héros',
                'description' => 'Effectuer 50 signalements validés',
                'icon' => 'star',
                'badge_color' => '#3b82f6',
                'points_required' => 500,
                'condition_type' => 'reports_count',
                'condition_value' => 50,
                'is_active' => true,
            ],
            [
                'name' => '👑 Champion Environnemental',
                'description' => 'Effectuer 100 signalements validés',
                'icon' => 'crown',
                'badge_color' => '#8b5cf6',
                'points_required' => 1000,
                'condition_type' => 'reports_count',
                'condition_value' => 100,
                'is_active' => true,
            ],
            [
                'name' => '💎 Légende Verte',
                'description' => 'Effectuer 500 signalements validés',
                'icon' => 'gem',
                'badge_color' => '#ef4444',
                'points_required' => 5000,
                'condition_type' => 'reports_count',
                'condition_value' => 500,
                'is_active' => true,
            ],
            [
                'name' => '🎯 Précision',
                'description' => 'Atteindre 1000 points',
                'icon' => 'target',
                'badge_color' => '#06b6d4',
                'points_required' => 1000,
                'condition_type' => 'points_earned',
                'condition_value' => 1000,
                'is_active' => true,
            ],
            [
                'name' => '🔄 Régularité',
                'description' => 'Effectuer des signalements 7 jours consécutifs',
                'icon' => 'refresh-cw',
                'badge_color' => '#84cc16',
                'points_required' => 200,
                'condition_type' => 'consecutive_days',
                'condition_value' => 7,
                'is_active' => true,
            ],
            [
                'name' => '🗺️ Explorateur',
                'description' => 'Signaler dans 10 zones différentes',
                'icon' => 'map',
                'badge_color' => '#f97316',
                'points_required' => 300,
                'condition_type' => 'zone_coverage',
                'condition_value' => 10,
                'is_active' => true,
            ],
            [
                'name' => '🌍 Ambassadeur Écologique',
                'description' => 'Signaler dans 25 zones différentes',
                'icon' => 'globe',
                'badge_color' => '#14b8a6',
                'points_required' => 750,
                'condition_type' => 'zone_coverage',
                'condition_value' => 25,
                'is_active' => true,
            ],
            [
                'name' => '⚡ Réactivité',
                'description' => 'Effectuer 30 signalements en une semaine',
                'icon' => 'zap',
                'badge_color' => '#eab308',
                'points_required' => 400,
                'condition_type' => 'reports_count',
                'condition_value' => 30,
                'is_active' => true,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
