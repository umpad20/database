<?php

namespace Database\Seeders;

use App\Models\Motorcycle;
use App\Models\MaintenanceRecord;
use App\Models\User;
use Illuminate\Database\Seeder;

class SyncMaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();
        
        foreach (Motorcycle::where('status', 'Maintenance')->get() as $m) {
            MaintenanceRecord::updateOrCreate(
                ['motorcycle_id' => $m->id, 'status' => 'in_progress'],
                [
                    'user_id' => $admin->id,
                    'type' => 'inspection',
                    'date' => now(),
                    'cost' => 0,
                    'description' => 'Existing maintenance status synced from fleet.',
                ]
            );
        }
    }
}
