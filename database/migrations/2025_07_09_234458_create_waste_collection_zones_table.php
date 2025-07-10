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
        Schema::create('waste_collection_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('district_id')->constrained()->onDelete('cascade');
            $table->json('coordinates'); // {lat, lng}
            $table->integer('radius_meters')->default(50);
            $table->integer('capacity_liters');
            $table->decimal('current_fill_level', 5, 2)->default(0);
            $table->timestamp('last_emptied_at')->nullable();
            $table->timestamp('next_collection_at')->nullable();
            $table->enum('priority_level', ['low', 'medium', 'high'])->default('low');
            $table->enum('zone_type', ['residential', 'commercial', 'industrial', 'public'])->default('residential');
            $table->boolean('is_active')->default(true);
            $table->string('sensor_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_collection_zones');
    }
};
