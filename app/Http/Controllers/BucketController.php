<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bucket;
use App\Models\BucketActivations;
use Illuminate\Support\Facades\Log;

class BucketController extends Controller
{

    public function registerBucketData(Request $request)
    {
        try {
            // Asegurar que el campo 'datetime' tenga un valor por defecto si no se proporciona
            $request->merge([
                'datetime' => $request->input('datetime', now()->format('Y-m-d H:i:s')),
            ]);
    
            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required|string', // Asegurar que 'mac_add' sea un string
                'datetime' => 'required|date', // Asegurar que 'datetime' sea una fecha válida
            ]);
    
            Log::info('Validated> ', ['validated' => $validated]);
    
            // Crear el registro en la base de datos usando el modelo QualityData
            $bucketData = BucketActivations::create($validated);
            Log::info('BucketData created successfully', ['bucketData' => $bucketData]);
    
        } catch (\Throwable $th) {
            Log::error('Error sending Bucket Data', [
                'error_message' => $th->getMessage(),
                'error_trace' => $th->getTraceAsString(),
                'request_data' => $request->all(), // Para registrar los datos que se están enviando
            ]);
    
            return response()->json([
                'message' => 'Error sending Bucket Data',
                'error' => $th->getMessage(),
            ], 500);
        }
    
        return response()->json([
            'message' => 'Quality Data registered successfully',
            'data' => $bucketData
        ], 201);
    }


    public function registerBucket(Request $request)
    {

        try {
            $validated = $request->validate([
                'mac_add' => 'required',
                'paired_with' => 'required',
                'buck_capacity' => 'required',
                'use' => 'required',
            ]);
            Log::info('Validated> ', ['validated' => $validated]);

            $sensor = Bucket::create($validated);
            Log::info('Bucket created successfully', ['sensor' => $sensor]);

        } catch (\Throwable $th) {
            Log::error('Error creating a new Bucket', ['error' => $th->getMessage()]);

            return response()->json([
                'message' => 'Error creating a new Bucket',
                'Error' => $th->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Bucket registered successfully',
            'data' => $sensor
        ], 201);
    }

    public function getBucket(Request $request)
    {
        return response()->json([
            'message' => 'Welcome to Bucket',
        ], 200);
    }
}
