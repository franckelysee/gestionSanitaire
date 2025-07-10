<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cameroonCities = [
            [
                'name' => 'Yaoundé',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 3.8480, 'lng' => 11.5021],
                'timezone' => 'Africa/Douala',
                'population' => 4164000,
                'is_active' => true,
            ],
            [
                'name' => 'Douala',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 4.0511, 'lng' => 9.7679],
                'timezone' => 'Africa/Douala',
                'population' => 3663000,
                'is_active' => true,
            ],
            [
                'name' => 'Bamenda',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 5.9631, 'lng' => 10.1591],
                'timezone' => 'Africa/Douala',
                'population' => 2277000,
                'is_active' => true,
            ],
            [
                'name' => 'Bafoussam',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 5.4737, 'lng' => 10.4158],
                'timezone' => 'Africa/Douala',
                'population' => 1200000,
                'is_active' => true,
            ],
            [
                'name' => 'Garoua',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 9.3265, 'lng' => 13.3958],
                'timezone' => 'Africa/Douala',
                'population' => 1285000,
                'is_active' => true,
            ],
            [
                'name' => 'Maroua',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 10.5913, 'lng' => 14.3153],
                'timezone' => 'Africa/Douala',
                'population' => 965000,
                'is_active' => true,
            ],
            [
                'name' => 'Ngaoundéré',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 7.3167, 'lng' => 13.5833],
                'timezone' => 'Africa/Douala',
                'population' => 411000,
                'is_active' => true,
            ],
            [
                'name' => 'Bertoua',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 4.5833, 'lng' => 13.6833],
                'timezone' => 'Africa/Douala',
                'population' => 218000,
                'is_active' => true,
            ],
            [
                'name' => 'Edéa',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 3.8000, 'lng' => 10.1333],
                'timezone' => 'Africa/Douala',
                'population' => 203000,
                'is_active' => true,
            ],
            [
                'name' => 'Loum',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 4.7167, 'lng' => 9.7333],
                'timezone' => 'Africa/Douala',
                'population' => 177000,
                'is_active' => true,
            ],
            [
                'name' => 'Kumba',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 4.6333, 'lng' => 9.4500],
                'timezone' => 'Africa/Douala',
                'population' => 144000,
                'is_active' => true,
            ],
            [
                'name' => 'Nkongsamba',
                'country' => 'Cameroun',
                'coordinates' => ['lat' => 4.9500, 'lng' => 9.9333],
                'timezone' => 'Africa/Douala',
                'population' => 117000,
                'is_active' => true,
            ],
        ];

        foreach ($cameroonCities as $cityData) {
            City::create($cityData);
        }
    }
}
