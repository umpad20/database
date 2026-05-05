<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MotorcycleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'plate_number' => 'required|string|unique:motorcycles,plate_number',
            'daily_rate' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'engine_no' => 'required|string|max:255',
            'chassis_no' => 'required|string|max:255',
            'color' => 'required|string|max:50',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('motorcycles', 'public');
        }

        Motorcycle::create([
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'year' => $validated['year'],
            'plate_number' => $validated['plate_number'],
            'daily_rate' => $validated['daily_rate'],
            'category_id' => $validated['category_id'],
            'engine_no' => $validated['engine_no'],
            'chassis_no' => $validated['chassis_no'],
            'color' => $validated['color'],
            'image_path' => $imagePath,
            'status' => 'Available',
        ]);

        return redirect()->back()->with('success', 'Motorcycle added successfully!');
    }

    public function update(Request $request, Motorcycle $motorcycle)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'plate_number' => 'required|string|unique:motorcycles,plate_number,' . $motorcycle->id,
            'daily_rate' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'engine_no' => 'required|string|max:255',
            'chassis_no' => 'required|string|max:255',
            'color' => 'required|string|max:50',
            'status' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($motorcycle->image_path) {
                Storage::disk('public')->delete($motorcycle->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('motorcycles', 'public');
        }

        $motorcycle->update(array_filter($validated, fn($k) => $k !== 'image', ARRAY_FILTER_USE_KEY));

        return redirect()->back()->with('success', 'Motorcycle updated successfully!');
    }

    public function destroy(Motorcycle $motorcycle)
    {
        if ($motorcycle->image_path) {
            Storage::disk('public')->delete($motorcycle->image_path);
        }
        $motorcycle->delete();

        return redirect()->back()->with('success', 'Motorcycle deleted successfully!');
    }

    public function toggleMaintenance(Motorcycle $motorcycle)
    {
        if ($motorcycle->status === 'Rented' || $motorcycle->status === 'Reserved') {
            return redirect()->back()->with('error', 'Cannot put a rented or reserved motorcycle into maintenance.');
        }

        $motorcycle->status = $motorcycle->status === 'Maintenance' ? 'Available' : 'Maintenance';
        $motorcycle->save();

        return redirect()->back()->with('success', 'Motorcycle status updated!');
    }
}
