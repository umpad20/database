<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Admin Account
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@motorent.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);


        // Default Customer Account
        $customerUser = User::factory()->create([
            'name' => 'Juan Dela Cruz',
            'email' => 'customer@motorent.com',
            'password' => bcrypt('customer123'),
            'role' => 'customer',
        ]);

        // Create customer profile
        Customer::create([
            'user_id' => $customerUser->id,
            'phone' => '09171234567',
            'address' => 'Butuan City, Agusan del Norte',
            'license_number' => 'N01-12-345678',
        ]);

        $this->call([
            CategorySeeder::class,
            MotorcycleSeeder::class,
        ]);
    }
}
