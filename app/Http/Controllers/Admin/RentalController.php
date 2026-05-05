<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Motorcycle;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function approve(Rental $rental)
    {
        $rental->update(['status' => 'approved']);
        
        // Mark bike as Reserved so others can't request it
        $rental->motorcycle->update(['status' => 'Reserved']);

        // Auto-reject other PENDING requests for this same bike
        Rental::where('motorcycle_id', $rental->motorcycle_id)
            ->where('status', 'pending')
            ->where('id', '!=', $rental->id)
            ->update(['status' => 'rejected']);
        
        return redirect()->back()->with('success', 'Rental approved! Other pending requests for this bike have been automatically rejected.');
    }

    public function reject(Rental $rental)
    {
        $rental->update(['status' => 'rejected']);
        
        // Release bike if it was reserved
        if ($rental->motorcycle->status === 'Reserved') {
            $rental->motorcycle->update(['status' => 'Available']);
        }
        
        return redirect()->back()->with('success', 'Rental rejected.');
    }

    public function start(Rental $rental)
    {
        $rental->update(['status' => 'active']);
        $rental->motorcycle->update(['status' => 'Rented']);
        
        return redirect()->back()->with('success', 'Rental started! Unit is now with the customer.');
    }

    public function complete(Rental $rental)
    {
        $rental->update(['status' => 'returned']);
        $rental->motorcycle->update(['status' => 'Available']);
        
        return redirect()->back()->with('success', 'Rental completed! Unit returned to fleet.');
    }
}
