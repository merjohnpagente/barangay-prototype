<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResidentRequest;
use App\Http\Resources\ResidentResource;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResidentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $search = trim((string) $request->query('search', ''));
        $filter = (string) $request->query('filter', 'all');

        $residents = Resident::query()
            ->when($search !== '', function ($query) use ($search): void {
                $needle = '%'.mb_strtolower($search).'%';

                $query->where(function ($query) use ($needle): void {
                    $query->whereRaw('LOWER(name) LIKE ?', [$needle])
                        ->orWhereRaw('LOWER(code) LIKE ?', [$needle]);
                });
            })
            ->when($filter === 'pwd', fn ($query) => $query->where('pwd', true))
            ->when($filter === 'pending', fn ($query) => $query->where('assistance', 'Pending'))
            ->orderByDesc('created_at')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return ResidentResource::collection($residents);
    }

    public function store(ResidentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $birthday = $data['birthday'] ?? null;

        $resident = Resident::query()->create([
            'code' => Resident::nextCode(),
            'name' => $data['name'],
            'age' => $birthday ? null : ($data['age'] ?? null),
            'birthday' => $birthday,
            'age_year' => now()->year,
            'sex' => $data['sex'] ?? null,
            'job' => $data['job'] ?? null,
            'purok' => $data['purok'] ?? null,
            'pwd' => ($data['pwd'] ?? 'No') === 'Yes',
            'assistance' => 'Pending',
            'need' => $data['need'] ?? null,
            'remarks' => $data['remarks'] ?? null,
        ]);

        return (new ResidentResource($resident))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Resident $resident): ResidentResource
    {
        return new ResidentResource($resident);
    }

    public function update(ResidentRequest $request, Resident $resident): ResidentResource
    {
        $data = $request->validated();
        $birthday = $data['birthday'] ?? null;

        $resident->update([
            'name' => $data['name'],
            'age' => $birthday ? null : ($data['age'] ?? $resident->age),
            'birthday' => $birthday,
            'age_year' => now()->year,
            'sex' => $data['sex'] ?? null,
            'job' => $data['job'] ?? null,
            'purok' => $data['purok'] ?? null,
            'pwd' => ($data['pwd'] ?? 'No') === 'Yes',
            'need' => $data['need'] ?? null,
            'remarks' => $data['remarks'] ?? null,
        ]);

        return new ResidentResource($resident->refresh());
    }

    public function toggleAssistance(Resident $resident): ResidentResource
    {
        $resident->update([
            'assistance' => $resident->assistance === 'Given' ? 'Pending' : 'Given',
        ]);

        return new ResidentResource($resident);
    }

    public function export(): StreamedResponse
    {
        $residents = Resident::query()
            ->orderByDesc('created_at')
            ->orderBy('id')
            ->get();

        $filename = 'barangay-residents-'.now()->toDateString().'.csv';

        return response()->streamDownload(function () use ($residents): void {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, ['ID', 'Name', 'Age', 'Birthday', 'Sex', 'Work', 'Purok', 'PWD', 'Assistance', 'Need', 'Remarks']);

            foreach ($residents as $resident) {
                fputcsv($output, [
                    $resident->code,
                    $resident->name,
                    $resident->currentAge(),
                    $resident->birthday?->format('Y-m-d'),
                    $resident->sex,
                    $resident->job,
                    $resident->purok,
                    $resident->pwd ? 'Yes' : 'No',
                    $resident->assistance,
                    $resident->need,
                    $resident->remarks,
                ]);
            }

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
