<?php

namespace App\Http\Controllers;

use App\Models\Quality;
use App\Models\QualityData;
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
    public function registerQualityData(Request $request)
    {
        try {
            // Asegurar que el campo 'datetime' tenga un valor por defecto si no se proporciona
            $request->merge([
                'datetime' => $request->input('datetime', now()->format('Y-m-d H:i:s')),
            ]);
    
            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required|string', // Asegurar que 'mac_add' sea un string
                'tds' => 'required|numeric',   // Asegurar que 'tds' sea un número
                'water_temp' => 'required|numeric', // Asegurar que 'water_temp' sea un número
                'datetime' => 'required|date', // Asegurar que 'datetime' sea una fecha válida
            ]);
    
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
    // public function getQualityData(Request $request)
    // {
    //     try {
    //         // Obtener los parámetros de la solicitud
    //         $macAdd = $request->input('mac_add');
    
    //         // Consulta base
    //         $query = QualityData::query();
    

    //         $query->where('mac_add', $macAdd);
            
    
    //         // Obtener el último registro 

    //         $query->orderBy('datetime', 'desc')->limit(1);

    
    //         // Obtener los datos
    //         $qualityData = $query->get();
    
    //         // Verificar si se encontraron datos
    //         if ($qualityData->isEmpty()) {
    //             return response()->json([
    //                 'message' => 'No data found',
    //             ], 404);
    //         }
    
    //         // Devolver los datos en formato JSON
    //         return response()->json([
    //             'message' => 'Data retrieved successfully',
    //             'data' => $qualityData,
    //         ], 200);
    
    //     } catch (\Throwable $th) {
    //         // Manejo de errores
    //         Log::error('Error retrieving Quality Data', [
    //             'error_message' => $th->getMessage(),
    //             'error_trace' => $th->getTraceAsString(),
    //         ]);
    
    //         return response()->json([
    //             'message' => 'Error retrieving Quality Data',
    //             'error' => $th->getMessage(),
    //         ], 500);
    //     }
    // }

    // RECIBE: mac_add DEL SENSOR DE TANQUE
    public function getQualityData(Request $request)
    {
        try {
            // Obtener los parámetros de la solicitud
            $macAdd = $request->input('paired_with');
    
            // Encontrar todos los registros de calidad con el paired_with proporcionado
            $quality = Quality::where('paired_with', $macAdd)
                ->get();

            $qualityData = $quality->map(function ($sensor) {
                $query = QualityData::where('mac_add', $sensor->mac_add)
                    ->orderBy('datetime', 'desc')
                    ->first(); // Obtener solo el último registro

                return [
                    'mac_add' => $query->mac_add,
                    'tds' => $query->tds
                ];
            });

            // Consulta base
            // $query = QualityData::where('mac_add', $macAdd)
            //                     ->orderBy('datetime', 'desc')
            //                     ->first(); // Obtener solo el último registro
    
            // Verificar si se encontraron datos
            if (!$qualityData) {
                return response()->json([
                    'message' => 'No data found',
                ], 404);
            }
    
            // Devolver los datos en formato JSON con la estructura requerida
            return response()->json([
                "qualityData" => $qualityData
            ], 200);
    
        } catch (\Throwable $th) {
            // Manejo de errores
            Log::error('Error retrieving Quality Data', [
                'error_message' => $th->getMessage(),
                'error_trace' => $th->getTraceAsString(),
            ]);
    
            return response()->json([
                'message' => 'Error retrieving Quality Data',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function getQualitySensors(Request $request)
    {
        $paired_with = $request->query('paired_with');
        if (!$paired_with) {
            return response()->json([
                'error' => 'El parámetro paired_with es requerido'
            ], 400);
        }

        $quality = Quality::where('paired_with', $paired_with)
            ->get();

        if ($quality->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron sensores de calidad con ese paired_with'
            ], 404);
        }

        return response()->json([
            'data' => $quality
        ], 200);
    }
    
}
