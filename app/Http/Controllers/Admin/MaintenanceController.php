<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRecord;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index()
    {
        $records = MaintenanceRecord::with(['motorcycle', 'admin'])
            ->latest()
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'motorcycle_id' => $record->motorcycle_id,
                    'motorcycle_name' => $record->motorcycle->brand . ' ' . $record->motorcycle->model,
                    'plate_number' => $record->motorcycle->plate_number,
                    'admin_name' => $record->admin->name,
                    'date' => $record->date,
                    'type' => $record->type,
                    'cost' => (float)$record->cost,
                    'status' => $record->status,
                    'description' => $record->description,
                ];
            });

        return Inertia::render('admin/maintenance/index', [
            'maintenanceRecords' => $records,
            'availableMotorcycles' => Motorcycle::where('status', 'Available')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'motorcycle_id' => 'required|exists:motorcycles,id',
            'type' => 'required|string',
            'cost' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $record = MaintenanceRecord::create([
            'motorcycle_id' => $validated['motorcycle_id'],
            'user_id' => auth()->id(),
            'type' => $validated['type'],
            'cost' => $validated['cost'],
            'date' => $validated['date'],
            'description' => $validated['description'],
            'status' => 'in_progress',
        ]);

        // Update motorcycle status
        Motorcycle::where('id', $validated['motorcycle_id'])->update(['status' => 'Maintenance']);

        return redirect()->back()->with('success', 'Service logged successfully!');
    }

    public function update(Request $request, MaintenanceRecord $maintenance)
    {
        $maintenance->update(['status' => 'completed']);

        // Update motorcycle status back to Available
        $maintenance->motorcycle->update(['status' => 'Available']);

        return redirect()->back()->with('success', 'Maintenance completed!');
    }
}
