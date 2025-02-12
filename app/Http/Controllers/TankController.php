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
                'offset' => 'required'
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
            $request->merge([
                'datetime' => $request->input('datetime', now()->format('Y-m-d H:i:s')),
            ]);
            // Validación de los datos
            $validated = $request->validate([
                'mac_add' => 'required',
                'water_distance' => 'required',
                'datetime' => 'required'
            ]);
            Log::info('Validated> ', ['validated' => $validated]);

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
        $results = \DB::table('tank_sensorsdb AS t')
            ->select('t.tank_capacity', 't.use', 't.tank_area', 't.max_height')
            ->join('homehub_devices_2 AS h', 'h.mac_add', '=', 't.paired_with')
            ->join('users AS u', 'u.user_id', '=', 'h.user_id')
            ->where('u.user_id', $user_id)
            ->get();
        return response()->json([
            'data' => $results
        ], 200);

    }

    public function getTankFillPercentage(Request $request)
    {
        // Obtener los parámetros de la solicitud
        $macAdd = $request->input('paired_with');

        // Encontrar todos los registros de calidad con el paired_with proporcionado
        $tanks = Tank::where('paired_with', $macAdd)
            ->get();

        // Lista de objetos
        $tankData = $tanks->map(function ($tank) {
            $macAdd = $tank->mac_add;
            $query = Tank::join('stored_waterdb as tank_data', 'tank_sensorsdb.mac_add', '=', 'tank_data.mac_add')
                ->where('tank_sensorsdb.mac_add', $macAdd)
                ->orderBy('tank_data.datetime', 'desc')
                ->select(
                    'tank_sensorsdb.use',
                    'tank_sensorsdb.tank_area',
                    'tank_sensorsdb.tank_capacity',
                    'tank_sensorsdb.max_height',
                    'tank_data.water_distance',
                    'tank_sensorsdb.offset'
                )
                ->first();

            return [
                'mac_add' => $macAdd,
                'water_distance' => $query->water_distance,
                'use' => $query->use,
                'tank_area' => $query->tank_area,
                'tank_capacity' => $query->tank_capacity,
                'max_height' => $query->max_height,
                'offset' => $query->offset
            ];
        });

        // return response()->json([
        //     'tankData' => $tankData
        // ]);

        // Obtener datos del tanque junto con la última lectura de distancia del agua
        // $tank = Tank::join('stored_waterdb as tank_data', 'tank_sensorsdb.mac_add', '=', 'tank_data.mac_add')
        //     ->where('tank_sensorsdb.mac_add', $macAdd)
        //     ->orderBy('tank_data.datetime', 'desc')
        //     ->select(
        //         'tank_sensorsdb.tank_area',
        //         'tank_sensorsdb.tank_capacity',
        //         'tank_sensorsdb.max_height',
        //         'tank_data.water_distance'
        //     )
        //     ->first();

        if (!$tankData) {
            return response()->json(["message" => "Tanque no encontrado o sin datos de nivel de agua"], 404);
        }


        // return response()->json([
        //     "type" => gettype($tankData),
        //     "len" => count($tankData),
        //     // "val" => $tankData
        // ]);

        $storageData = $tankData->map(function ($tank) {

            $offset_mm = $tank['offset']; // Convertir mm a m Valor vacio del tanque  (760)
            $max_height_mm = $tank['max_height']; // Convertir mm a m  (2140)
            $water_distance_mm = $tank['water_distance']; // Convertir mm a m  (913)

            $a = $max_height_mm + $offset_mm - $water_distance_mm;  // 2140 + 760 - 913 = 1987
            $b = $a + $water_distance_mm - $offset_mm;  // 1987 + 913 - 760 = 2140 

            $percentage = (1 - (($b-$a)/$b))*100; 
            $remaining_liters = ($a * $tank['tank_area']) ; 

            return [
                "mac_add" => $tank['mac_add'],
                "use" => $tank['use'],
                "fill_percentage" => round($percentage, 0),
                "remaining_liters" => round($remaining_liters, 0)
            ];
        });

        return response()->json($storageData);

        // $storageData = array_map(function ($tank) {

        //     return response()->json([
        //         "tankData" => $tank
        //     ]);

        //     // Convertir todo a metros
        //     $max_height_m = $tank['max_height'] / 1000; // Convertir mm a m
        //     $water_distance_m = $tank['water_distance'] / 1000; // Convertir mm a m

        //     // Calcular la altura del agua en metros
        //     $water_height_m = $max_height_m - $water_distance_m;

        //     // Calcular el volumen de agua en metros cúbicos
        //     $volume_m3 = $tank['tank_area'] * $water_height_m;

        //     // Convertir el volumen a litros (1 m³ = 1000 litros)
        //     $volume_liters = $volume_m3 * 1000;

        //     // Calcular el porcentaje de llenado usando la capacidad registrada en la base de datos
        //     $percentage = ($volume_liters / $tank['tank_capacity']) * 100;

        //     return [
        //         "mac_add" => $tank['mac_add'],
        //         "fill_percentage" => round($percentage, 2)
        //     ];
        // }, $tankData);

        // return response()->json($storageData);
    }

}
