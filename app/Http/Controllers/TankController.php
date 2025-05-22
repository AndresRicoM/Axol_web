<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use App\Models\TankData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TankController extends Controller
{
    public function registerTank(Request $request)
    {
        try {
            // Log the incoming request data
            Log::info('Incoming request data: ', $request->all());

            $validated = $request->validate([
                'mac_add' => 'required|string',
                'paired_with' => 'required|string',
                'tank_capacity' => 'required|numeric',
                'use' => 'required|string',
                'max_height' => 'required|numeric',
                'offset' => 'nullable|numeric',
                'diameter' => 'nullable|numeric',
                'width' => 'nullable|numeric',
                'height' => 'required|numeric',
                'depth' => 'nullable|numeric'
            ]);

            Log::info('Validated> ', ['validated' => $validated]);

            $sensor = Tank::create($validated);
            Log::info('Tank created successfully', ['sensor' => $sensor]);
        } catch (\Throwable $th) {
            Log::error('Error creating a new Tank', ['error' => $th->getMessage()]);

            return response()->json([
                'message' => 'Error creating a new Tank',
                'Error' => $th->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Tank registered successfully',
            'data' => $sensor
        ], 201);
    }

    public function registerTankData(Request $request)
    {
        try {
            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required',
                'water_distance' => 'required',
            ]);
            $validated["datetime"] = Carbon::now();

            Log::info('Validated> ', ['validated' => $validated]);

            // Crear el registro en la base de datos
            $sensor = TankData::create($validated);
            Log::info('New tank data stored successfully', ['sensor' => $sensor]);
        } catch (\Throwable $th) {
            Log::error('Error sending Tank Data', [
                'error_message' => $th->getMessage(),
                // 'error_trace' => $th->getTraceAsString(),
                // 'request_data' => $request->all(), // Para registrar los datos que se están enviando
            ]);

            return response()->json([
                'message' => 'Error sending Tank Data',
                'error' => $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Data Tank registered successfully',
            'data' => $sensor
        ], 201);
    }
}
