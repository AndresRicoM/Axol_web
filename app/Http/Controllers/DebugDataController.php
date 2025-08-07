<?php

namespace App\Http\Controllers;
use App\Models\DebugSensorData;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DebugDataController extends Controller
{
    public function registerDebugData(Request $request)
    {
        try {

            // Validación de los datos
            $validated = $request->validate(rules: [
                'mac_add' => 'string', 
                'tds' => 'numeric',   
                'water_temp' => 'numeric', 
                'humidity' => 'numeric',
                'water_distance' => 'numeric'
            ]);
            $validated["datetime"] = Carbon::now();

            Log::info('Validated> ', ['validated' => $validated]);

            $debugData = DebugSensorData::create($validated);
            Log::info('Debug Data created successfully', ['debugData' => $debugData]);
        } catch (\Throwable $th) {
            Log::error('Error sending Debug Data', [
                'error_message' => $th->getMessage(),
                'error_trace' => $th->getTraceAsString(),
                'request_data' => $request->all(), // Para registrar los datos que se están enviando
            ]);

            return response()->json([
                'message' => 'Error sending Debug Data',
                'error' => $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Debug Data registered successfully',
            'data' => $debugData
        ], 201);

    }
}
