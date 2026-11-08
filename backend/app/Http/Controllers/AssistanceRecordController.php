<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssistanceRecordRequest;
use App\Http\Resources\AssistanceRecordResource;
use App\Models\AssistanceRecord;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssistanceRecordController extends Controller
{
    public function index(Resident $resident): AnonymousResourceCollection
    {
        $records = $resident->assistanceRecords()
            ->with('user')
            ->orderByDesc('given_at')
            ->orderByDesc('id')
            ->get();

        return AssistanceRecordResource::collection($records);
    }

    public function store(AssistanceRecordRequest $request, Resident $resident): JsonResponse
    {
        $data = $request->validated();

        $record = $resident->assistanceRecords()->create([
            'user_id' => $request->user()?->id,
            'program' => $data['program'],
            'item' => $data['item'] ?? null,
            'amount' => $data['amount'] ?? null,
            'given_at' => $data['given_at'],
            'remarks' => $data['remarks'] ?? null,
        ]);

        if ($resident->assistance !== 'Given') {
            $resident->update(['assistance' => 'Given']);
        }

        return (new AssistanceRecordResource($record->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Resident $resident, AssistanceRecord $record): JsonResponse
    {
        abort_unless($record->resident_id === $resident->id, 404);

        $record->delete();

        if ($resident->assistanceRecords()->count() === 0) {
            $resident->update(['assistance' => 'Pending']);
        }

        return response()->json(['message' => 'Assistance record deleted.']);
    }
}
