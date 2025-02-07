<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bucket;
use Illuminate\Support\Facades\Log;

class BucketController extends Controller
{
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
