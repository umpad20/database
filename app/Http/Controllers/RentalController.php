<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Motorcycle;
use App\Models\Rental;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RentalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'motorcycle_id' => 'required|exists:motorcycles,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'id_document' => 'required|image|max:10240',
            'license_document' => 'required|image|max:10240',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'license_number' => 'required|string|max:50',
            'fulfillment_type' => 'required|string|in:pickup,delivery',
            'pickup_location' => 'required|string|max:255',
            'return_location' => 'required|string|max:255',
        ]);

        $motorcycle = Motorcycle::findOrFail($validated['motorcycle_id']);
        $user = auth()->user();
        
        // Update customer profile with newest info
        $customer = $user->customer;
        if (!$customer) {
            $customer = Customer::create([
                'user_id' => $user->id,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'license_number' => $validated['license_number'],
            ]);
        } else {
            $customer->update([
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'license_number' => $validated['license_number'],
            ]);
        }

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate);
        if ($days === 0) $days = 1;

        $idPath = $request->file('id_document')->store('rentals/documents', 'public');
        $licensePath = $request->file('license_document')->store('rentals/documents', 'public');

        $rental = Rental::create([
            'customer_id' => $customer->id,
            'motorcycle_id' => $motorcycle->id,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_amount' => $motorcycle->daily_rate * $days,
            'status' => 'pending',
            'id_document_path' => $idPath,
            'license_document_path' => $licensePath,
            'fulfillment_type' => $validated['fulfillment_type'],
            'pickup_location' => $validated['pickup_location'],
            'return_location' => $validated['return_location'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Rental request submitted successfully!');
    }
}
