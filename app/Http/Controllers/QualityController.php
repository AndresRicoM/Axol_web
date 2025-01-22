<?php

namespace App\Http\Controllers;

use App\Models\Quality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QualityController extends Controller
{
    //
    public function registerQuality(Request $request)
    {

        try {
            $validated = $request->validate([
                'mac_add' => 'required',
                'paired_with' => 'required',
                'use' => 'required',
            ]);
            Log::info('Validated> ', ['validated' => $validated]);

            $sensor = Quality::create($validated);
            Log::info('Quality created successfully', ['sensor' => $sensor]);

        } catch (\Throwable $th) {
            Log::error('Error creating a new Quality', ['error' => $th->getMessage()]);

            return response()->json([
                'message' => 'Error creating a new Quality',
                'Error' => $th->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Quality registered successfully',
            'data' => $sensor
        ], 201);
    }
}
