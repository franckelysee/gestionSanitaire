<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\District;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Quartiers de Yaoundé
        $yaounde = City::where('name', 'Yaoundé')->first();
        if ($yaounde) {
            $yaoundeDistricts = [
                [
                    'name' => 'Centre-ville',
                    'city_id' => $yaounde->id,
                    'coordinates' => [
                        ['lat' => 3.8691, 'lng' => 11.5174],
                        ['lat' => 3.8691, 'lng' => 11.5274],
                        ['lat' => 3.8591, 'lng' => 11.5274],
                        ['lat' => 3.8591, 'lng' => 11.5174]
                    ],
                    'population' => 85000,
                    'area_km2' => 12.5,
                ],
                [
                    'name' => 'Bastos',
                    'city_id' => $yaounde->id,
                    'coordinates' => [
                        ['lat' => 3.8791, 'lng' => 11.5074],
                        ['lat' => 3.8791, 'lng' => 11.5174],
                        ['lat' => 3.8691, 'lng' => 11.5174],
                        ['lat' => 3.8691, 'lng' => 11.5074]
                    ],
                    'population' => 45000,
                    'area_km2' => 8.2,
                ],
                [
                    'name' => 'Mfoundi',
                    'city_id' => $yaounde->id,
                    'coordinates' => [
                        ['lat' => 3.8591, 'lng' => 11.5174],
                        ['lat' => 3.8591, 'lng' => 11.5274],
                        ['lat' => 3.8491, 'lng' => 11.5274],
                        ['lat' => 3.8491, 'lng' => 11.5174]
                    ],
                    'population' => 120000,
                    'area_km2' => 15.8,
                ],
                [
                    'name' => 'Nlongkak',
                    'city_id' => $yaounde->id,
                    'coordinates' => [
                        ['lat' => 3.8891, 'lng' => 11.5174],
                        ['lat' => 3.8891, 'lng' => 11.5274],
                        ['lat' => 3.8791, 'lng' => 11.5274],
                        ['lat' => 3.8791, 'lng' => 11.5174]
                    ],
                    'population' => 95000,
                    'area_km2' => 11.3,
                ],
                [
                    'name' => 'Emombo',
                    'city_id' => $yaounde->id,
                    'coordinates' => [
                        ['lat' => 3.8391, 'lng' => 11.5074],
                        ['lat' => 3.8391, 'lng' => 11.5174],
                        ['lat' => 3.8291, 'lng' => 11.5174],
                        ['lat' => 3.8291, 'lng' => 11.5074]
                    ],
                    'population' => 78000,
                    'area_km2' => 9.7,
                ],
            ];

            foreach ($yaoundeDistricts as $district) {
                District::create($district);
            }
        }

        // Quartiers de Douala
        $douala = City::where('name', 'Douala')->first();
        if ($douala) {
            $doualaDistricts = [
                [
                    'name' => 'Akwa',
                    'city_id' => $douala->id,
                    'coordinates' => [
                        ['lat' => 4.0611, 'lng' => 9.7579],
                        ['lat' => 4.0611, 'lng' => 9.7679],
                        ['lat' => 4.0511, 'lng' => 9.7679],
                        ['lat' => 4.0511, 'lng' => 9.7579]
                    ],
                    'population' => 125000,
                    'area_km2' => 18.4,
                ],
                [
                    'name' => 'Bonanjo',
                    'city_id' => $douala->id,
                    'coordinates' => [
                        ['lat' => 4.0511, 'lng' => 9.7679],
                        ['lat' => 4.0511, 'lng' => 9.7779],
                        ['lat' => 4.0411, 'lng' => 9.7779],
                        ['lat' => 4.0411, 'lng' => 9.7679]
                    ],
                    'population' => 98000,
                    'area_km2' => 14.2,
                ],
                [
                    'name' => 'Bassa',
                    'city_id' => $douala->id,
                    'coordinates' => [
                        ['lat' => 4.0411, 'lng' => 9.7579],
                        ['lat' => 4.0411, 'lng' => 9.7679],
                        ['lat' => 4.0311, 'lng' => 9.7679],
                        ['lat' => 4.0311, 'lng' => 9.7579]
                    ],
                    'population' => 156000,
                    'area_km2' => 22.1,
                ],
                [
                    'name' => 'Deido',
                    'city_id' => $douala->id,
                    'coordinates' => [
                        ['lat' => 4.0711, 'lng' => 9.7679],
                        ['lat' => 4.0711, 'lng' => 9.7779],
                        ['lat' => 4.0611, 'lng' => 9.7779],
                        ['lat' => 4.0611, 'lng' => 9.7679]
                    ],
                    'population' => 142000,
                    'area_km2' => 19.8,
                ],
                [
                    'name' => 'New Bell',
                    'city_id' => $douala->id,
                    'coordinates' => [
                        ['lat' => 4.0311, 'lng' => 9.7679],
                        ['lat' => 4.0311, 'lng' => 9.7779],
                        ['lat' => 4.0211, 'lng' => 9.7779],
                        ['lat' => 4.0211, 'lng' => 9.7679]
                    ],
                    'population' => 189000,
                    'area_km2' => 25.6,
                ],
            ];

            foreach ($doualaDistricts as $district) {
                District::create($district);
            }
        }
    }
}
