<?php

namespace App\Http\Controllers;

use App\Models\Quality;
use App\Models\QualityData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


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
    public function registerQualityData(Request $request)
    {
        try {

            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required|string', // Asegurar que 'mac_add' sea un string
                'tds' => 'required|numeric',   // Asegurar que 'tds' sea un número
                'water_temp' => 'required|numeric', // Asegurar que 'water_temp' sea un número
                'humidity' => 'required|numeric',
            ]);
            $validated["datetime"] = Carbon::now();

            Log::info('Validated> ', ['validated' => $validated]);

            // Crear el registro en la base de datos usando el modelo QualityData
            $qualityData = QualityData::create($validated);
            Log::info('QualityData created successfully', ['qualityData' => $qualityData]);
        } catch (\Throwable $th) {
            Log::error('Error sending Quality Data', [
                'error_message' => $th->getMessage(),
                'error_trace' => $th->getTraceAsString(),
                'request_data' => $request->all(), // Para registrar los datos que se están enviando
            ]);

            return response()->json([
                'message' => 'Error sending Quality Data',
                'error' => $th->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Quality Data registered successfully',
            'data' => $qualityData
        ], 201);
    }
}
