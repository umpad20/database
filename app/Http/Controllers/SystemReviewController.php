<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\SystemReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SystemReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rental_id' => 'required|exists:rentals,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $rental = Rental::findOrFail($validated['rental_id']);

        // Security checks
        if ($rental->customer_id !== Auth::user()->customer->id) {
            abort(403);
        }

        if ($rental->status !== 'returned') {
            return back()->with('error', 'You can only review after returning the motorcycle.');
        }

        if ($rental->review()->exists()) {
            return back()->with('error', 'You have already reviewed this rental.');
        }

        SystemReview::create([
            'rental_id' => $validated['rental_id'],
            'customer_id' => Auth::user()->customer->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Thank you for your feedback!');
    }
}
