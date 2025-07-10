<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed cities and districts first
        $this->call([
            CitySeeder::class,
            DistrictSeeder::class,
            WasteCollectionZoneSeeder::class,
            AchievementSeeder::class,
        ]);

        // Create admin user
        User::factory()->create([
            'name' => 'Administrateur',
            'email' => 'admin@ecosmart.cm',
            'role' => 'admin',
            'points' => 0,
            'level' => 1,
            'is_active' => true,
        ]);

        // Create collector user
        User::factory()->create([
            'name' => 'Collecteur Test',
            'email' => 'collector@ecosmart.cm',
            'role' => 'collector',
            'points' => 0,
            'level' => 1,
            'is_active' => true,
        ]);

        // Create citizen user
        User::factory()->create([
            'name' => 'Citoyen Test',
            'email' => 'citizen@ecosmart.cm',
            'role' => 'citizen',
            'points' => 150,
            'level' => 2,
            'is_active' => true,
        ]);

        // Create additional test users
        User::factory(20)->create([
            'role' => 'citizen',
            'points' => fake()->numberBetween(0, 1000),
            'level' => fake()->numberBetween(1, 5),
            'is_active' => true,
        ]);
    }
}
