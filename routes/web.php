<?php

use App\Models\Motorcycle;
use App\Models\Customer;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ===== PUBLIC PAGES =====
Route::get('/', function () {
    return Inertia::render('welcome', [
        'motorcycles' => Motorcycle::where('status', 'Available')->take(6)->get()
    ]);
})->name('home');

Route::get('/motorcycles', function () {
    return Inertia::render('motorcycles/index', [
        'motorcycles' => Motorcycle::all()
    ]);
})->name('motorcycles.index');

Route::get('/motorcycles/{id}', function ($id) {
    return Inertia::render('motorcycles/show', [
        'motorcycle' => Motorcycle::findOrFail($id)
    ]);
})->name('motorcycles.show');

// ===== AUTHENTICATED ROUTES =====
Route::middleware(['auth'])->group(function () {

    // Customer Dashboard
    Route::get('dashboard', function () {
        $user = auth()->user();
        $customer = $user->customer;

        $rentals = [];
        $stats = [
            'pending_requests' => 0,
            'active_rentals' => 0,
            'total_rentals' => 0,
            'payment_due' => 0,
        ];
        $currentRental = null;

        if ($customer) {
            $rentals = Rental::where('customer_id', $customer->id)
                ->with('motorcycle')
                ->latest()
                ->take(5)
                ->get();

            $stats = [
                'pending_requests' => Rental::where('customer_id', $customer->id)->where('status', 'pending')->count(),
                'active_rentals' => Rental::where('customer_id', $customer->id)->where('status', 'active')->count(),
                'total_rentals' => Rental::where('customer_id', $customer->id)->count(),
                'payment_due' => Rental::where('customer_id', $customer->id)->whereIn('status', ['approved', 'active'])->sum('total_amount'),
            ];

            $currentRental = Rental::where('customer_id', $customer->id)
                ->whereIn('status', ['active', 'approved'])
                ->with('motorcycle')
                ->first();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentRentals' => $rentals,
            'currentRental' => $currentRental,
        ]);
    })->name('dashboard');

    // Rental Request
    Route::get('rentals/create', function (Illuminate\Http\Request $request) {
        $motorcycleId = $request->query('motorcycle');
        $motorcycle = $motorcycleId ? Motorcycle::find($motorcycleId) : null;
        
        return Inertia::render('rentals/create', [
            'motorcycle' => $motorcycle
        ]);
    })->name('rentals.create');

    // Rental History
    Route::get('rentals/history', function () {
        $user = auth()->user();
        $customer = $user->customer;
        $rentals = [];

        if ($customer) {
            $rentals = Rental::where('customer_id', $customer->id)
                ->with('motorcycle')
                ->latest()
                ->get();
        }

        return Inertia::render('rentals/history', [
            'rentals' => $rentals,
        ]);
    })->name('rentals.history');

    // ===== ADMIN ROUTES =====
    Route::prefix('admin')->name('admin.')->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        Route::get('dashboard', function () {
            $stats = [
                'totalCustomers' => Customer::count(),
                'totalMotorcycles' => Motorcycle::count(),
                'availableMotorcycles' => Motorcycle::where('status', 'Available')->count(),
                'activeRentals' => Rental::where('status', 'active')->count(),
                'pendingApprovals' => Rental::where('status', 'pending')->count(),
                'underMaintenance' => Motorcycle::where('status', 'Maintenance')->count(),
                'pendingPayments' => Rental::where('status', 'approved')->count(),
                'monthlyRevenue' => Rental::whereIn('status', ['paid', 'active', 'returned'])
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_amount'),
            ];

            $recentRequests = Rental::with(['customer.user', 'motorcycle'])
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('admin/dashboard', [
                'stats' => $stats,
                'recentRequests' => $recentRequests,
            ]);
        })->name('dashboard');

        Route::get('motorcycles', function () {
            return Inertia::render('admin/motorcycles/index', [
                'motorcycles' => Motorcycle::all()
            ]);
        })->name('motorcycles');

        Route::post('motorcycles', [\App\Http\Controllers\Admin\MotorcycleController::class, 'store'])->name('motorcycles.store');
        Route::put('motorcycles/{motorcycle}', [\App\Http\Controllers\Admin\MotorcycleController::class, 'update'])->name('motorcycles.update');
        Route::delete('motorcycles/{motorcycle}', [\App\Http\Controllers\Admin\MotorcycleController::class, 'destroy'])->name('motorcycles.destroy');
        Route::patch('motorcycles/{motorcycle}/maintenance', [\App\Http\Controllers\Admin\MotorcycleController::class, 'toggleMaintenance'])->name('motorcycles.maintenance');

        Route::get('rentals', function () {
            return Inertia::render('admin/rentals/index', [
                'rentals' => Rental::with(['customer.user', 'motorcycle'])->latest()->get(),
            ]);
        })->name('rentals');

        Route::get('payments', function () {
            // No payments table yet, passing empty array
            return Inertia::render('admin/payments/index', [
                'payments' => []
            ]);
        })->name('payments');

        Route::get('maintenance', [\App\Http\Controllers\Admin\MaintenanceController::class, 'index'])->name('maintenance');
        Route::post('maintenance', [\App\Http\Controllers\Admin\MaintenanceController::class, 'store'])->name('maintenance.store');
        Route::patch('maintenance/{maintenance}', [\App\Http\Controllers\Admin\MaintenanceController::class, 'update'])->name('maintenance.update');


        Route::get('customers', function () {
            return Inertia::render('admin/customers/index', [
                'customers' => Customer::with('user')->get(),
            ]);
        })->name('customers');

        Route::get('categories', function () {
            // Derived from motorcycles table
            $categories = Motorcycle::select('category')
                ->selectRaw('count(*) as count')
                ->groupBy('category')
                ->get()
                ->map(function($item, $index) {
                    return [
                        'id' => $index + 1,
                        'name' => $item->category,
                        'count' => $item->count,
                        'description' => 'Motorcycles classified under ' . $item->category . '.'
                    ];
                });

            return Inertia::render('admin/categories/index', [
                'categories' => $categories
            ]);
        })->name('categories');

        Route::get('reports', function () {
            $stats = [
                [ 'label' => 'Total Rentals', 'value' => Rental::count(), 'period' => 'All Time' ],
                [ 'label' => 'Total Revenue', 'value' => '₱' . number_format(Rental::whereIn('status', ['paid', 'active', 'returned'])->sum('total_amount')), 'period' => 'All Time' ],
                [ 'label' => 'Active Customers', 'value' => Customer::count(), 'period' => 'All Time' ],
                [ 'label' => 'Fleet Size', 'value' => Motorcycle::count(), 'period' => 'Current' ],
            ];

            return Inertia::render('admin/reports/index', [
                'summaryData' => $stats
            ]);
        })->name('reports');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

