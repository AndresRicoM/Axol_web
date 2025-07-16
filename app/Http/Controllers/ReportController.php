<?php

namespace App\Http\Controllers;

use App\Models\Homehub;
use App\Models\Tank;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\TankTrait;

class ReportController extends Controller
{
    use TankTrait;

    public function generateReport(Request $request)
    {
        $request->validate([
            'mac_add'    => 'required|exists:homehub_devices_practice,mac_add',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $query = Homehub::with([
            'qualitySensors:mac_add,use,paired_with',
            'qualitySensors.logs' => function ($query) use ($request) {
                if ($request->start_date && $request->end_date) {
                    $query->whereBetween('datetime', [
                        $request->start_date,
                        $request->end_date
                    ]);
                }
            },
            'qualitySensors.latestLog:tds,mac_add,datetime,humidity',
            'tankSensors:mac_add,use,diameter,width,height,offset,paired_with,width,depth',
            'tankSensors.logs' => function ($query) use ($request) {
                if ($request->start_date && $request->end_date) {
                    $query->whereBetween('datetime', [
                        $request->start_date,
                        $request->end_date
                    ]);
                }
            },
            'tankSensors.latestLog:water_distance,mac_add,datetime',
        ])->where('mac_add', $request->mac_add)->first();

        if (!$query) {
            return response()->json(['message' => 'No data found'], 404);
        }

        // Procesar sensores de tanque
        $tankSensors = [];
        foreach ($query->tankSensors as $tank) {
            $tankVolume = $this->getVolume($tank->toArray());
            $monthlyConsumption = $this->getMonthlyConsumption($tank, $tankVolume);

            // Calcular remaining_liters usando tu fórmula
            $remaining_liters = 0;
            $lastLog = $tank->latestLog;
            $latestDistance = $lastLog?->water_distance / 1000;
            if ($lastLog && $tank->height > 0) {
                $a = $tank->height + $tank->offset - $latestDistance;
                $remaining_liters = ($a / $tank->height) * $tankVolume * 1000;
                $remaining_liters = round($remaining_liters, 0);
            }

            $tankSensors[] = [
                'mac_add'  => $tank->mac_add,
                'use'      => $tank->use,
                'logs'     => $tank->logs->map(function ($log) {
                    return [
                        'mac_add'        => $log->mac_add,
                        'water_distance' => $log->water_distance,
                        'datetime'       => $log->datetime,
                    ];
                })->values(),
                'storage'  => [
                    'monthly_consumption' => $monthlyConsumption,
                    'remaining_liters'    => $remaining_liters,
                ],
            ];
        }

        // Procesar sensores de calidad
        $qualitySensors = [];
        foreach ($query->qualitySensors as $sensor) {
            $qualitySensors[] = [
                'mac_add'    => $sensor->mac_add,
                'use'        => $sensor->use,
                'paired_with' => $sensor->paired_with,
                'logs'       => $sensor->logs->map(function ($log) {
                    return [
                        'mac_add'     => $log->mac_add,
                        'tds'         => $log->tds,
                        'water_temp'  => $log->water_temp,
                        'datetime'    => $log->datetime,
                        'humidity'    => $log->humidity,
                    ];
                })->values(),
                'latest_log' => $sensor->latestLog ? [
                    'tds'      => $sensor->latestLog->tds,
                    'mac_add'  => $sensor->latestLog->mac_add,
                    'datetime' => $sensor->latestLog->datetime,
                    'humidity' => $sensor->latestLog->humidity,
                ] : null,
            ];
        }

        // Estructura final para el PDF y frontend
        $data = [
            'homehub'        => [
                'name'    => $query->name,
                'mac_add' => $query->mac_add,
            ],
            'sensors'        => $tankSensors,
            'quality_sensors' => $qualitySensors,
        ];

        return response()->json([
            'data'    => $data,
            'message' => 'data successfully retrieved',
        ]);
    public function getData()
    {

    }

    public function getDataForAnalysis(Request $request)
    {
        $username = $request->username;

        $query = User::select('username', 'user_id')
            ->with([
                'homehubs:user_id,mac_add,name',
                'homehubs.tankSensors',
                'homehubs.qualitySensors',
                'homehubs.weatherData',
                'homehubs.tankSensors.tankData',
                'homehubs.qualitySensors.qualityData',
            ])
            ->where('username', $username)
            ->first();

        return response()->json($query);
    }
}
