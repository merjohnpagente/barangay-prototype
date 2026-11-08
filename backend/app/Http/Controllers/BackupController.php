<?php

namespace App\Http\Controllers;

use App\Services\DatabaseBackupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BackupController extends Controller
{
    public function index(DatabaseBackupService $backups): JsonResponse
    {
        return response()->json([
            'backups' => $backups->list(),
        ]);
    }

    public function store(DatabaseBackupService $backups): JsonResponse
    {
        try {
            $path = $backups->create();
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Backup created.',
            'backup' => basename($path),
            'backups' => $backups->list(),
        ], 201);
    }

    public function download(string $file, DatabaseBackupService $backups)
    {
        try {
            $path = $backups->pathFor($file);
        } catch (Throwable $exception) {
            abort(404, $exception->getMessage());
        }

        return response()->download($path, $file, ['Content-Type' => 'application/octet-stream']);
    }

    public function restoreExisting(string $file, DatabaseBackupService $backups): JsonResponse
    {
        try {
            $backups->restore($backups->pathFor($file));
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Database restored. Please reload the app.']);
    }

    public function restoreUpload(Request $request, DatabaseBackupService $backups): JsonResponse
    {
        $request->validate([
            'backup' => ['required', 'file', 'max:51200'],
        ]);

        try {
            $backups->restore($request->file('backup')->getRealPath());
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Database restored. Please reload the app.']);
    }
}
