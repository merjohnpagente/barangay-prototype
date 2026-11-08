<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::fallback(function (Request $request) {
    if ($request->is('api/*')) {
        return response()->json(['message' => 'Not found.'], 404);
    }

    $spa = storage_path('app/spa/index.html');

    abort_unless(is_file($spa), 404, 'Frontend build not found.');

    return response()->file($spa);
});
