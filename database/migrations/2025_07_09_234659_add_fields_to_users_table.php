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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('phone');
            $table->enum('role', ['admin', 'collector', 'citizen'])->default('citizen')->after('avatar');
            $table->integer('points')->default(0)->after('role');
            $table->integer('level')->default(1)->after('points');
            $table->foreignId('district_id')->nullable()->constrained()->after('level');
            $table->boolean('is_active')->default(true)->after('district_id');
            $table->timestamp('last_activity_at')->nullable()->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'avatar',
                'role',
                'points',
                'level',
                'district_id',
                'is_active',
                'last_activity_at'
            ]);
        });
    }
};
