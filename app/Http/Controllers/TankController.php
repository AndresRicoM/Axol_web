<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use App\Models\TankData;
use App\Models\Homehub;
use App\Models\User;
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
    public function registerTanKData(Request $request)
    {
        try {
            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required',
                'water_distance' => 'required',
                'datetime' => 'required'
            ]);
            Log::info('Validated> ', ['validated' => $validated]);
    
            // Verificar si 'datetime' está presente; si no, usar la fecha y hora actual
            if (!isset($validated['datetime'])) {
                $validated['datetime'] = \Carbon\Carbon::now()->format('Y-m-d H:i:s');
            }
    
            // Crear el registro en la base de datos
            $sensor = TankData::create($validated);
            Log::info('Tank created successfully', ['sensor' => $sensor]);
    
        } catch (\Throwable $th) {
            Log::error('Error sending Tank Data', [
                'error_message' => $th->getMessage(),
                'error_trace' => $th->getTraceAsString(),
                'request_data' => $request->all(), // Para registrar los datos que se están enviando
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
        $results = \DB::table('tank_sensorsdb_practice_ui AS t')
            ->select('t.tank_capacity', 't.use', 't.tank_area', 't.max_height')
            ->join('homehub_devices_practice AS h', 'h.mac_add', '=', 't.paired_with')
            ->join('users_practice_ui AS u', 'u.user_id', '=', 'h.user_id')
            ->where('u.user_id', $user_id)
            ->get();
        return response()->json([
            'data' => $results
        ], 200);

    }
}
