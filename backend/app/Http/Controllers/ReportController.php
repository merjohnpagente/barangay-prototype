<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function index(): JsonResponse
    {
        $total = Resident::query()->count();
        $assisted = Resident::query()->where('assistance', 'Given')->count();

        $bars = collect(['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5'])
            ->map(function (string $purok): array {
                $residents = Resident::query()->where('purok', $purok);
                $count = (clone $residents)->count();
                $given = (clone $residents)->where('assistance', 'Given')->count();

                return [
                    'purok' => $purok,
                    'total' => $count,
                    'assisted' => $given,
                    'percent' => $count ? (int) round($given / $count * 100) : 0,
                ];
            })
            ->values();

        return response()->json([
            'summary' => [
                'total' => $total,
                'pwd' => Resident::query()->where('pwd', true)->count(),
                'assisted' => $assisted,
                'pending' => $total - $assisted,
            ],
            'puroks' => $bars,
            'projects' => [
                ['name' => 'Feeding Program', 'percent' => 82],
                ['name' => 'Medical Mission', 'percent' => 58],
                ['name' => 'Clean-up Drive', 'percent' => 100],
                ['name' => 'Livelihood Training', 'percent' => 36],
            ],
        ]);
    }
}
