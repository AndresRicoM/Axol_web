<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Homehub;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\Tank;

use function PHPSTORM_META\map;

class HomehubController extends Controller
{
    public function registerHomehub(Request $request)
    {

        // return response()->json([
        //     "data" => $request->username
        // ], 200);

        $user = User::where('username', $request->username)->first();
        if (!$user) {
            Log::error('User not found');

            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $user_id = $user->user_id;

        try {
            $validated = $request->validate([
                'mac_add' => 'required',
                'lat' => 'required',
                'lon' => 'required',
                'name' => 'required',
            ]);
            $validated['user_id'] = $user_id;
            Log::info('Validated>', ['validated' => $validated]);

            $homehub = Homehub::create($validated);
            Log::info('Homehub created successfully', ['homehub' => $homehub]);

        } catch (\Throwable $th) {
            Log::error('Error creating a new Homehub', ['error' => $th->getMessage()]);

            return response()->json([
                'message' => 'Error creating a new Homehub',
                'Error' => $th->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Homehub registered successfully',
            'data' => $homehub
        ], 201);
    }

    public function getHomehub(Request $request)
    {
        $userId = $request->input('user_id');
        $homehub = Homehub::where('user_id', $userId)->get();
        // $homehubIds = $homehub->pluck('mac_add');

        Log::info('Homehub data:', ['user_id' => $userId, 'homehub' => $homehub]);
        return response()->json([
            "homehub" => $homehub

        ], 200);
    }

    public function getSensors(User $user)
    {
        $data = $user->homehubs()
            ->with(['qualitySensors:mac_add,use,paired_with', 
                    'qualitySensors.logs:tds,mac_add,datetime', 
                    'tankSensors:mac_add,use,tank_type,diameter,width,max_height,offset,paired_with',
                    'tankSensors.logs:water_distance,mac_add,datetime'])
            ->get();

        if ($data->isEmpty()) {
            return [];
        }

        return $data->map(function ($homehub) {
            // Combinar qualitySensors y tankSensors en una sola colección
            $qualityData = $homehub->qualitySensors->map(function ($sensor) {
                return [
                    'type' => 'quality',
                    'mac_add' => $sensor->mac_add,
                    'use' => $sensor->use,
                    'tds' => $sensor->logs->tds ?? null,
                    'datetime' => $sensor->logs?->datetime ?? null,
                ];
            });

            $tankData = $homehub->tankSensors->map(function ($sensor){
                $tank_area = 0;
                if ($sensor['tank_type'] == 'cylindrical') {
                    $radius = $sensor['diameter'] / 2;
                    $tank_area = pi() * pow($radius, 2);
                } elseif ($sensor['tank_type'] == 'rectangular') {
                    $tank_area = ($sensor['width'] * $sensor['max_height'] / 2000);
                }

                $offset_mm = $sensor['offset'];
                $max_height_mm = $sensor['max_height'];
                $water_distance_mm = $sensor->logs?->water_distance ?? null;

                $percentage = 0;
                $remaining_liters = 0;

                if(isset($offset_mm, $max_height_mm, $water_distance_mm, $tank_area)){
                    $a = $max_height_mm + $offset_mm - $water_distance_mm;
                    $b = $a + $water_distance_mm - $offset_mm;

                    if ($b != 0) {
                        $percentage = (1 - (($b - $a) / $b)) * 100;
                    } else {
                        $percentage = 0;
                    }
                    $remaining_liters = ($a * $tank_area);
                }

                return [
                    'mac_add' => $sensor->mac_add,
                    'use' => $sensor->use,
                    'water_distance' => $sensor->logs->water_distance ?? null,
                    'fill_percentage' => round($percentage, 0),
                    'remaining_liters' => round($remaining_liters, 0),
                    'datetime' => $sensor->logs?->datetime,
                ];
            });

            // Agrupar sensores por "use"
            $groupedSensors = [];
            foreach ($qualityData as $quality) {
                $use = $quality['use'];
                if (!isset($groupedSensors[$use])) {
                    $groupedSensors[$use] = [];
                }
                $groupedSensors[$use]['quality'] = $quality;
            }

            foreach ($tankData as $tank) {
                $use = $tank['use'];
                if (!isset($groupedSensors[$use])) {
                    $groupedSensors[$use] = [];
                }
                $groupedSensors[$use]['storage'] = $tank;
            }

            // Convierte el array asociativo en un array indexado
            $sensors = array_values($groupedSensors);

            return [
                'homehub' => [
                    'lat' => $homehub->lat,
                    'lon' => $homehub->lon,
                    'mac_add' => $homehub->mac_add,
                    'name' => $homehub->name,
                    'user_id' => $homehub->user_id,
                ],
                'sensors' => $sensors,
            ];
        });
    }

}
