<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $total = Resident::query()->count();
        $assisted = Resident::query()->where('assistance', 'Given')->count();

        $recent = Resident::query()
            ->orderByDesc('created_at')
            ->orderBy('id')
            ->limit(5)
            ->get();

        $pending = Resident::query()
            ->where('assistance', 'Pending')
            ->orderByDesc('created_at')
            ->orderBy('id')
            ->limit(4)
            ->get();

        return response()->json([
            'summary' => [
                'total' => $total,
                'pwd' => Resident::query()->where('pwd', true)->count(),
                'assisted' => $assisted,
                'pending' => $total - $assisted,
            ],
            'recent' => ResidentResource::collection($recent)->resolve(),
            'pending' => ResidentResource::collection($pending)->resolve(),
        ]);
    }
}
