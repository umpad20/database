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
        
        // Mark bike as Reserved so others can't request it for the same dates
        $rental->motorcycle->update(['status' => 'Reserved']);
        
        return redirect()->back()->with('success', 'Rental approved and unit reserved!');
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
