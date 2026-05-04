<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['rental.customer.user', 'rental.motorcycle'])
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'rental_id' => $p->rental_id,
                    'customer_name' => $p->rental->customer->user->name,
                    'motorcycle_name' => $p->rental->motorcycle->brand . ' ' . $p->rental->motorcycle->model,
                    'date' => $p->paid_at ? $p->paid_at->format('Y-m-d H:i') : $p->created_at->format('Y-m-d H:i'),
                    'method' => $p->method,
                    'amount' => (float)$p->amount,
                    'status' => $p->status,
                ];
            });

        return Inertia::render('admin/payments/index', [
            'payments' => $payments
        ]);
    }

    public function markAsPaid(Payment $payment)
    {
        $payment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Payment marked as received!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rental_id' => 'required|exists:rentals,id',
            'amount' => 'required|numeric|min:0',
            'method' => 'required|string',
            'status' => 'required|string',
            'transaction_id' => 'nullable|string',
        ]);

        $payment = Payment::create([
            'rental_id' => $validated['rental_id'],
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'status' => $validated['status'],
            'transaction_id' => $validated['transaction_id'],
            'paid_at' => $validated['status'] === 'paid' ? now() : null,
        ]);

        if ($validated['status'] === 'paid') {
            Rental::where('id', $validated['rental_id'])->update(['status' => 'paid']);
        }

        return redirect()->back()->with('success', 'Payment logged successfully!');
    }
}
