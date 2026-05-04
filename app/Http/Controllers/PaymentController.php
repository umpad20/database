<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Rental;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request, Rental $rental)
    {
        // Ensure the rental belongs to the authenticated user
        if ($rental->customer->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow payment if the rental is approved
        if ($rental->status !== 'approved') {
            return redirect()->back()->with('error', 'Rental must be approved before payment.');
        }

        $validated = $request->validate([
            'method' => 'required|string|in:GCash,Bank Transfer,Cash on Pickup',
            'transaction_id' => 'nullable|string|max:100',
        ]);

        $payment = Payment::updateOrCreate(
            ['rental_id' => $rental->id, 'status' => 'pending'],
            [
                'amount' => $rental->total_amount,
                'method' => $validated['method'],
                'status' => $validated['method'] === 'Cash on Pickup' ? 'pending' : 'paid',
                'transaction_id' => $validated['transaction_id'],
                'paid_at' => $validated['method'] === 'Cash on Pickup' ? null : now(),
            ]
        );

        // Update rental status to 'paid' to hide the "Pay to Confirm" button
        $rental->update(['status' => 'paid']);

        return redirect()->route('dashboard')->with('success', 'Payment submitted successfully!');
    }
}
