<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Motorcycle;

class MotorcycleSeeder extends Seeder
{
    public function run(): void
    {
        $motorcycles = [
            [
                'brand' => 'Honda',
                'model' => 'Click 160',
                'category' => 'Scooter',
                'daily_rate' => 500,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'ABC-1234',
                'year' => 2024,
            ],
            [
                'brand' => 'Honda',
                'model' => 'ADV 160',
                'category' => 'Scooter',
                'daily_rate' => 700,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'DEF-5678',
                'year' => 2024,
            ],
            [
                'brand' => 'Honda',
                'model' => 'BeAT',
                'category' => 'Scooter',
                'daily_rate' => 400,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'GHI-9012',
                'year' => 2023,
            ],
            [
                'brand' => 'Yamaha',
                'model' => 'NMAX 155',
                'category' => 'Automatic',
                'daily_rate' => 800,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'JKL-3456',
                'year' => 2024,
            ],
            [
                'brand' => 'Yamaha',
                'model' => 'Aerox 155',
                'category' => 'Automatic',
                'daily_rate' => 800,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'MNO-7890',
                'year' => 2024,
            ],
            [
                'brand' => 'Yamaha',
                'model' => 'Sniper 155',
                'category' => 'Manual',
                'daily_rate' => 600,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'PQR-1234',
                'year' => 2023,
            ],
            [
                'brand' => 'Kawasaki',
                'model' => 'Ninja 400',
                'category' => 'Big Bike',
                'daily_rate' => 2500,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'STU-5678',
                'year' => 2023,
            ],
            [
                'brand' => 'Honda',
                'model' => 'Rebel 500',
                'category' => 'Big Bike',
                'daily_rate' => 3000,
                'status' => 'Available',
                'image_path' => null,
                'plate_number' => 'VWX-9012',
                'year' => 2024,
            ]
        ];

        foreach ($motorcycles as $motorcycle) {
            Motorcycle::create($motorcycle);
        }
    }
}
