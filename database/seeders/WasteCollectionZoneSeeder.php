<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\WasteCollectionZone;

class WasteCollectionZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = District::all();

        foreach ($districts as $district) {
            // Créer 5-8 zones de collecte par quartier
            $zoneCount = rand(5, 8);

            for ($i = 1; $i <= $zoneCount; $i++) {
                $baseCoords = $district->coordinates[0]; // Premier point du polygone

                // Générer des coordonnées aléatoires dans le quartier
                $lat = $baseCoords['lat'] + (rand(-50, 50) / 10000);
                $lng = $baseCoords['lng'] + (rand(-50, 50) / 10000);

                $zoneTypes = ['residential', 'commercial', 'industrial', 'public'];
                $priorities = ['low', 'medium', 'high'];

                WasteCollectionZone::create([
                    'name' => "Zone {$i} - {$district->name}",
                    'district_id' => $district->id,
                    'coordinates' => ['lat' => $lat, 'lng' => $lng],
                    'radius_meters' => rand(30, 100),
                    'capacity_liters' => rand(500, 2000),
                    'current_fill_level' => rand(0, 100),
                    'last_emptied_at' => now()->subDays(rand(0, 7)),
                    'next_collection_at' => now()->addDays(rand(1, 3)),
                    'priority_level' => $priorities[array_rand($priorities)],
                    'zone_type' => $zoneTypes[array_rand($zoneTypes)],
                    'is_active' => true,
                    'sensor_id' => 'SENSOR_' . strtoupper(uniqid()),
                ]);
            }
        }
    }
}
