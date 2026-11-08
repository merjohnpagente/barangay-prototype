<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assistance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('program');
            $table->string('item')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->date('given_at');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['resident_id', 'given_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistance_records');
    }
};
