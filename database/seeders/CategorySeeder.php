<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Scooter', 'description' => 'Lightweight, automatic motorcycles for city commuting.'],
            ['name' => 'Big Bike', 'description' => 'High-displacement motorcycles for touring and performance.'],
            ['name' => 'Manual/Clutch', 'description' => 'Standard motorcycles with manual transmission.'],
            ['name' => 'Automatic', 'description' => 'Standard motorcycles with automatic transmission.'],
            ['name' => 'Electric', 'description' => 'Eco-friendly electric motorcycles.'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
