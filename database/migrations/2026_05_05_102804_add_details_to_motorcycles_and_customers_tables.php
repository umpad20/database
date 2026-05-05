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
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->string('engine_no')->nullable()->after('plate_number');
            $table->string('chassis_no')->nullable()->after('engine_no');
            $table->string('color')->nullable()->after('chassis_no');
            $table->foreignId('category_id')->nullable()->after('model')->constrained('categories')->nullOnDelete();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('middle_name')->nullable()->after('id');
            $table->string('gender')->nullable()->after('middle_name');
            $table->date('date_of_birth')->nullable()->after('gender');
            $table->date('license_expiry_date')->nullable()->after('license_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['engine_no', 'chassis_no', 'color', 'category_id']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['middle_name', 'gender', 'date_of_birth', 'license_expiry_date']);
        });
    }
};
