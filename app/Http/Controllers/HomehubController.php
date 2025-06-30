<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Homehub;
use App\Models\User;
use App\Traits\QualityTrait;
use App\Traits\TankTrait;
use Illuminate\Support\Facades\Log;

class HomehubController extends Controller
{
    use TankTrait, QualityTrait;

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
            ->with([
                'qualitySensors:mac_add,use,paired_with',
                'qualitySensors.logsYear:tds,mac_add,datetime',
                'qualitySensors.latestLog:tds,mac_add,datetime,humidity',
                'tankSensors:mac_add,use,diameter,width,height,offset,paired_with,width,depth',
                'tankSensors.logsYear:water_distance,mac_add,datetime',
                'tankSensors.latestLog:water_distance,mac_add,datetime'
            ])
            ->get();

        if ($data->isEmpty()) {
            return [];
        }

        return $data->map(function ($homehub) {

            $qualityData = $homehub->qualitySensors->map(function ($sensor) {
                $monthlyQuality = $this->getAllQualityData($sensor);
                return [
                    'type' => 'quality',
                    'mac_add' => $sensor->mac_add,
                    'use' => $sensor->use,
                    'tds' => round($sensor->latestLog?->tds, 0),
                    'datetime' => $sensor->latestLog?->datetime,
                    'humidity' => $sensor->latestLog?->humidity,
                    'monthlyQuality' => $monthlyQuality,
                ];
            });

            $tankData = $homehub->tankSensors->map(function ($sensor) {
                //CALCULO DEL VOLUMEN DEL TANQUE
                $tank_volume = $this->getVolume($sensor);

                $offset = $sensor['offset'];
                $height = $sensor['height'];

                // Obtener el último dato
                $latestLog = $sensor->latestLog;
                $latestDistance = $latestLog?->water_distance / 1000;

                //Calcular consumo de agua mensual por sensor
                $monthlyConsumption = $this->getMonthlyConsumption($sensor, $tank_volume);

                // Cálculo de porcentaje y litros restantes
                $percentage = 0;
                $remaining_liters = 0;

                if (isset($offset, $height, $latestDistance, $tank_volume)) {
                    $a = $height + $offset - $latestDistance;
                    $b = $a + $latestDistance - $offset;

                    if ($height != 0) {
                        $percentage = (1 - (($b - $a) / $b)) * 100;
                    } else {
                        $percentage = 0;
                    }
                    $remaining_liters = ($a / $height) * $tank_volume * 1000;
                }

                return [
                    'mac_add' => $sensor->mac_add,
                    'use' => $sensor->use,
                    'water_distance' => $latestLog?->water_distance,
                    'fill_percentage' => round($percentage, 0),
                    'remaining_liters' => round($remaining_liters, 0),
                    'datetime' => $latestLog?->datetime,
                    'monthly_consumption' => $monthlyConsumption,
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
