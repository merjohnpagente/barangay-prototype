<?php

use App\Http\Controllers\AssistanceRecordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResidentController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/reports', [ReportController::class, 'index']);

    Route::get('/residents/export', [ResidentController::class, 'export']);
    Route::get('/residents', [ResidentController::class, 'index']);
    Route::post('/residents', [ResidentController::class, 'store']);
    Route::get('/residents/{resident}', [ResidentController::class, 'show']);
    Route::put('/residents/{resident}', [ResidentController::class, 'update']);
    Route::patch('/residents/{resident}/assistance', [ResidentController::class, 'toggleAssistance']);

    Route::get('/residents/{resident}/assistance-records', [AssistanceRecordController::class, 'index']);
    Route::post('/residents/{resident}/assistance-records', [AssistanceRecordController::class, 'store']);
    Route::delete('/residents/{resident}/assistance-records/{record}', [AssistanceRecordController::class, 'destroy']);

    Route::get('/backups', [BackupController::class, 'index']);
    Route::post('/backups', [BackupController::class, 'store']);
    Route::post('/backups/restore', [BackupController::class, 'restoreUpload']);
    Route::get('/backups/{file}/download', [BackupController::class, 'download'])->where('file', '[A-Za-z0-9._-]+');
    Route::post('/backups/{file}/restore', [BackupController::class, 'restoreExisting'])->where('file', '[A-Za-z0-9._-]+');
});
