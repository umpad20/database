<?php

use App\Models\Motorcycle;
use App\Models\Customer;
use App\Models\Rental;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\Admin\MotorcycleController;
use App\Http\Controllers\Admin\RentalController as AdminRentalController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Admin\PaymentController;

// ===== PUBLIC PAGES =====
Route::get('/', function () {
    return Inertia::render('welcome', [
        'motorcycles' => Motorcycle::where('status', 'Available')->take(6)->get(),
        'reviews' => \App\Models\SystemReview::with('customer.user')->where('is_visible', true)->latest()->take(6)->get()
    ]);
})->name('home');

Route::get('/motorcycles', function () {
    return Inertia::render('motorcycles/index', [
        'motorcycles' => Motorcycle::where('status', 'Available')->get()
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
                'payment_due' => Rental::where('customer_id', $customer->id)
                    ->whereIn('status', ['approved', 'active'])
                    ->whereDoesntHave('payment', function ($query) {
                        $query->where('status', 'paid');
                    })
                    ->sum('total_amount'),
            ];

            $currentRental = Rental::where('customer_id', $customer->id)
                ->whereIn('status', ['pending', 'approved', 'paid', 'active'])
                ->with(['motorcycle', 'payment'])
                ->latest()
                ->first();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentRentals' => $rentals,
            'currentRental' => $currentRental,
        ]);
    })->name('dashboard');

    // Rental Booking
    Route::get('rentals/create', function (Illuminate\Http\Request $request) {
        $motorcycleId = $request->query('motorcycle');
        $motorcycle = $motorcycleId ? Motorcycle::find($motorcycleId) : null;
        
        return Inertia::render('rentals/create', [
            'motorcycle' => $motorcycle
        ]);
    })->name('rentals.create');

    Route::post('rentals', [RentalController::class, 'store'])->name('rentals.store');

    // Rental History
    Route::get('rentals/history', function () {
        $user = auth()->user();
        $customer = $user->customer;
        $rentals = [];

        if ($customer) {
            $rentals = Rental::where('customer_id', $customer->id)
                ->with(['motorcycle', 'payment', 'review'])
                ->latest()
                ->get();
        }

        return Inertia::render('rentals/history', [
            'rentals' => $rentals,
        ]);
    })->name('rentals.history');

    // ===== ADMIN ROUTES =====
    Route::prefix('admin')->name('admin.')->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        
        // Admin Dashboard
        Route::get('dashboard', function () {
            $stats = [
                'totalCustomers' => Customer::count(),
                'totalMotorcycles' => Motorcycle::count(),
                'availableMotorcycles' => Motorcycle::where('status', 'Available')->count(),
                'activeRentals' => Rental::where('status', 'active')->count(),
                'pendingApprovals' => Rental::where('status', 'pending')->count(),
                'underMaintenance' => Motorcycle::where('status', 'Maintenance')->count(),
                'pendingPayments' => Rental::where('status', 'approved')->count(),
                'monthlyRevenue' => Payment::where('status', 'paid')->whereMonth('created_at', now()->month)->sum('amount'),
                'totalRevenue' => Payment::where('status', 'paid')->sum('amount'),
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

        // Fleet Management
        Route::get('motorcycles', function () {
            return Inertia::render('admin/motorcycles/index', [
                'motorcycles' => Motorcycle::with('category')->get(),
                'categories' => \App\Models\Category::all()
            ]);
        })->name('motorcycles');

        Route::post('motorcycles', [MotorcycleController::class, 'store'])->name('motorcycles.store');
        Route::put('motorcycles/{motorcycle}', [MotorcycleController::class, 'update'])->name('motorcycles.update');
        Route::delete('motorcycles/{motorcycle}', [MotorcycleController::class, 'destroy'])->name('motorcycles.destroy');
        Route::patch('motorcycles/{motorcycle}/maintenance', [MotorcycleController::class, 'toggleMaintenance'])->name('motorcycles.maintenance');

        // Rental Management
        Route::get('rentals', function () {
            return Inertia::render('admin/rentals/index', [
                'rentals' => Rental::with(['customer.user', 'motorcycle', 'payment'])->latest()->get(),
            ]);
        })->name('rentals');

        Route::patch('rentals/{rental}/approve', [AdminRentalController::class, 'approve'])->name('rentals.approve');
        Route::patch('rentals/{rental}/reject', [AdminRentalController::class, 'reject'])->name('rentals.reject');
        Route::patch('rentals/{rental}/start', [AdminRentalController::class, 'start'])->name('rentals.start');
        Route::patch('rentals/{rental}/complete', [AdminRentalController::class, 'complete'])->name('rentals.complete');

        // Payment Management
        Route::get('payments', [PaymentController::class, 'index'])->name('payments');
        Route::patch('payments/{payment}/paid', [PaymentController::class, 'markAsPaid'])->name('payments.paid');
        Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');

        // Maintenance Management
        Route::get('maintenance', [MaintenanceController::class, 'index'])->name('maintenance');
        Route::post('maintenance', [MaintenanceController::class, 'store'])->name('maintenance.store');
        Route::patch('maintenance/{maintenance}', [MaintenanceController::class, 'update'])->name('maintenance.update');

        // Customer Management
        Route::get('customers', function () {
            return Inertia::render('admin/customers/index', [
                'customers' => Customer::with('user')->get(),
            ]);
        })->name('customers');

        // Category Management
        Route::get('categories', function () {
            return Inertia::render('admin/categories/index', [
                'categories' => \App\Models\Category::withCount('motorcycles')->get()
            ]);
        })->name('categories');

        // Reports
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
    Route::post('rentals/{rental}/pay', [App\Http\Controllers\PaymentController::class, 'store'])->name('rentals.pay');
    Route::post('reviews', [App\Http\Controllers\SystemReviewController::class, 'store'])->name('reviews.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
