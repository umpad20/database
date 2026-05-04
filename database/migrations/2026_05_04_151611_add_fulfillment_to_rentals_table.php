<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->string('fulfillment_type')->default('pickup'); // pickup, delivery
            $table->string('pickup_location')->nullable();
            $table->string('return_location')->nullable();
            $table->text('fulfillment_notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn(['fulfillment_type', 'pickup_location', 'return_location', 'fulfillment_notes']);
        });
    }
};
