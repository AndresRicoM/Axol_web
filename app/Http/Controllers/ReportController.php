<?php

namespace App\Http\Controllers;

use App\Models\Homehub;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\TankTrait;

class ReportController extends Controller
{
    use TankTrait;

    public function generateReport(Request $request)
    {
        $request->validate([
            'mac_add'    => 'required|exists:homehub_devices_2,mac_add',
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

        // Agrupar sensores por uso
        $sensorsByUse = [];

        // Calcular días esperados para cobertura
        $startDate = new \DateTime($request->start_date);
        $endDate = new \DateTime($request->end_date);
        $daysDiff = $endDate->diff($startDate)->days + 1; // +1 para incluir ambos días
        $expectedDataPoints = $daysDiff * 2; // Esperamos 2 datos por día (mañana y tarde)

        // Procesar sensores de tanque
        foreach ($query->tankSensors as $tank) {
            $tankVolume = $this->getVolume($tank->toArray());

            $startDate = $request->start_date;
            $endDate = $request->end_date;
            $consumptionByRange = $this->getConsumptionByRange($tank, $tankVolume, $startDate, $endDate);
            $capturedWater = $this->getCapturedWater($tank, $tankVolume);

            // Calcular litros restantes
            $remaining_liters = 0;
            $lastLog = $tank->latestLog;
            $latestDistance = $lastLog?->water_distance / 1000;
            if ($lastLog && $tank->height > 0) {
                $a = $tank->height + $tank->offset - $latestDistance;
                $remaining_liters = ($a / $tank->height) * $tankVolume * 1000;
                $remaining_liters = round($remaining_liters, 0);
            }

            // Calcular cobertura de datos para tanque
            $actualDataCount = $tank->logs->count();
            $coveragePercentage = $expectedDataPoints > 0 ? round(($actualDataCount / $expectedDataPoints) * 100, 1) : 0;

            $tankData = [
                'mac_add'  => $tank->mac_add,
                'use'      => $tank->use,
                'logs'     => $tank->logs->map(function ($log) {
                    return [
                        'mac_add'        => $log->mac_add,
                        'water_distance' => $log->water_distance,
                        'datetime'       => $log->datetime,
                    ];
                })->values(),
                'range_consumption' => $consumptionByRange,
                'remaining_liters'    => $remaining_liters,
                'captured_water'      => $capturedWater,
                'data_coverage' => [
                    'percentage' => $coveragePercentage,
                    'actual_count' => $actualDataCount,
                    'expected_count' => $expectedDataPoints,
                ],
            ];

            // Inicializar el grupo si no existe
            if (!isset($sensorsByUse[$tank->use])) {
                $sensorsByUse[$tank->use] = [];
            }
            $sensorsByUse[$tank->use]['storage'] = $tankData;
        }

        // Procesar sensores de calidad
        foreach ($query->qualitySensors as $sensor) {
            // Calcular cobertura de datos para calidad
            $actualDataCount = $sensor->logs->count();
            $coveragePercentage = $expectedDataPoints > 0 ? round(($actualDataCount / $expectedDataPoints) * 100, 1) : 0;

            $qualityData = [
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
                'data_coverage' => [
                    'percentage' => $coveragePercentage,
                    'actual_count' => $actualDataCount,
                    'expected_count' => $expectedDataPoints,
                ],
            ];

            // Inicializar el grupo si no existe
            if (!isset($sensorsByUse[$sensor->use])) {
                $sensorsByUse[$sensor->use] = [];
            }
            $sensorsByUse[$sensor->use]['quality'] = $qualityData;
        }

        // Convertir a array con índices numéricos
        $sensors = array_values($sensorsByUse);

        // Estructura final para el PDF y frontend
        $data = [
            'homehub' => [
                'name'    => $query->name,
                'mac_add' => $query->mac_add,
            ],
            'sensors' => $sensors,
        ];

        return response()->json([
            'data'    => $data,
            'message' => 'data successfully retrieved',
        ]);
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
                'homehubs.tankSensors.logs',
                'homehubs.qualitySensors.logs',
            ])
            ->where('username', $username)
            ->first();

        return response()->json($query);
    }
}
