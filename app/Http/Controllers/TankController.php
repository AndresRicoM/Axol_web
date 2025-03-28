<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use App\Models\TankData;
use App\Models\Homehub;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use function PHPUnit\Framework\isEmpty;

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
                'tank_type' => 'required|string|in:cylindrical,rectangular',
                'diameter' => 'required_if:tank_type,cylindrical|numeric',
                'width' => 'required_if:tank_type,rectangular|numeric',
            ]);

            // Convert length and max_height from millimeters to meters
            $length = $validated['max_height'] / 1000 ;
            $width = isset($validated['width']) ? $validated['width'] / 1000 : null;

            // Calculate the area based on the tank type
            if ($validated['tank_type'] == 'cylindrical') {
                $radius = $validated['diameter'] / 2;
                $validated['tank_area'] = pi() * pow($radius, 2);
            } elseif ($validated['tank_type'] == 'rectangular') {
                $validated['tank_area'] = $width * $length;
            }


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


    public function getTank(Request $request)
    {
        $paired_with = $request->query('paired_with');
        if (!$paired_with) {
            return response()->json([
                'error' => 'El parámetro paired_with es requerido'
            ], 400);
        }

        $tanks = Tank::select('mac_add', 'paired_with', 'tank_capacity', 'use', 'max_height', 'tank_type', 'diameter', 'length', 'width')
            ->where('paired_with', $paired_with)
            ->get();

        if ($tanks->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron tanques con ese paired_with'
            ], 404);
        }

        $tanks = $tanks->map(function ($tank) {
            // Convert length and max_height from millimeters to meters
            $tank->length = isset($tank->length) ? $tank->length / 1000 : null;
            $tank->max_height = $tank->max_height / 1000;

            // Calculate the area based on the tank type
            if ($tank->tank_type == 'cylindrical') {
                $radius = $tank->diameter / 2;
                $tank->tank_area = pi() * pow($radius, 2);
            } elseif ($tank->tank_type == 'rectangular') {
                $tank->tank_area = $tank->length * $tank->width;
            }
            return $tank;
        });

        return response()->json([
            'data' => $tanks
        ], 200);
    }

    public function getSensors(Request $request)
    {
        $user = $request->user();
        $user_id = $user["user_id"];
        $results = \DB::table('tank_sensorsdb_ui_ui AS t')
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
                    'tank_sensorsdb_practice_ui.use',
                    'tank_sensorsdb_practice_ui.tank_capacity',
                    'tank_sensorsdb_practice_ui.max_height',
                    'tank_sensorsdb_practice_ui.tank_type',
                    'tank_sensorsdb_practice_ui.diameter',
                    'tank_sensorsdb_practice_ui.width',
                    'tank_data.water_distance',
                    'tank_sensorsdb.offset'
                )
                ->first();
            
            if($query){
                return [
                    'mac_add' => $macAdd,
                    'water_distance' => $query->water_distance,
                    'use' => $query->use,
                    'tank_capacity' => $query->tank_capacity,
                    'max_height' => $query->max_height,
                    'offset' => $query->offset,
                    'tank_type' => $query->tank_type,
                    'diameter' => $query->diameter,
                    'width' => $query->width,


                ];
            } else{
                return null;
            }
        })->filter();


        if ($tankData->isEmpty()) {
            return response()->json(["message" => "Tanque no encontrado o sin datos de nivel de agua"], 404);
        }



        $storageData = $tankData->map(function ($tank) {

            // Calculate the area based on the tank type
            if ($tank['tank_type'] == 'cylindrical') {
                $radius = $tank['diameter'] / 2;
                $tank_area = pi() * pow($radius, 2);
            } elseif ($tank['tank_type'] == 'rectangular') {
                $tank_area = ($tank ['width'] * $tank['max_height']/2000);
            }

            $offset_mm = $tank['offset']; // Convertir mm a m Valor vacio del tanque  (760)
            $max_height_mm = $tank['max_height']; // Convertir mm a m  (2140)
            $water_distance_mm = $tank['water_distance']; // Convertir mm a m  (913)

            $a = $max_height_mm + $offset_mm - $water_distance_mm;  // 2140 + 760 - 913 = 1987
            $b = $a + $water_distance_mm - $offset_mm;  // 1987 + 913 - 760 = 2140 

            $percentage = (1 - (($b - $a) / $b)) * 100;
            $remaining_liters = ($a * $tank_area);

            return [
                "mac_add" => $tank['mac_add'],
                "use" => $tank['use'],
                "fill_percentage" => round($percentage, 0),
                "remaining_liters" => round($remaining_liters, 0)
            ];
        });

        return response()->json($storageData);
    }
}
