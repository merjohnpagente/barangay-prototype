<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name')->unique();
            $table->unsignedSmallInteger('age')->nullable();
            $table->date('birthday')->nullable();
            $table->unsignedSmallInteger('age_year')->nullable();
            $table->string('sex')->nullable();
            $table->string('job')->nullable();
            $table->string('purok')->nullable();
            $table->boolean('pwd')->default(false);
            $table->string('assistance')->default('Pending');
            $table->string('need')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
