<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class TankController extends Controller
{
    public function registerTank(Request $request)
    {

        try {
            $validated = $request->validate([
                'mac_add' => 'required',
                'paired_with' => 'required',
                'tank_capacity' => 'required',
                'use' => 'required',
                'tank_area' => 'required',
                'max_height' => 'required',
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

    public function getTank(Request $request)
    {
        $paired_with = $request->query('paired_with');
        if (!$paired_with) {
            return response()->json([
                'error' => 'El parámetro paired_with es requerido'
            ], 400);
        }

        $tank = Tank::select('mac_add', 'paired_with', 'tank_capacity', 'use', 'tank_area', 'max_height')
            ->where('paired_with', $paired_with)
            ->get();

        if ($tank->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron tanques con ese paired_with'
            ], 404);
        }

        return response()->json([
            'data' => $tank
        ], 200);
    }

    public function getSensors(Request $request)
    {
        $user = $request->user();
        $user_id = $user["user_id"];
        $sensors = Tank::select('tank_capacity', 'use', 'tank_area', 'max_height')
            ->where('user_id', $user_id)
            ->get();
        return response()->json([
            'data' => "hola"
        ], 200);

    }
}
