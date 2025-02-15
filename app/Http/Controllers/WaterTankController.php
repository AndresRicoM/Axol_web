<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WaterTankController extends Controller
{
    public function getWaterData($id)
    {
        // Inicialización de variables
        $tankNum = 0;
        $totalMass = 0;
        $totalCapacity = 0;
        $totalVolume = 0;
        $totalFill = 0;

        // Obtener sensores de tanque
        $tankSensors = DB::select("SELECT mac_add FROM tank_sensorsdb WHERE paired_with = ?", [$id]);

        foreach ($tankSensors as $sensor) {
            $tankNum++;

            // Obtener distancia del agua más reciente
            $height = DB::select("
                SELECT water_distance 
                FROM stored_waterdb_practice_ui 
                WHERE mac_add = ?
                ORDER BY datetime DESC 
                LIMIT 1
            ", [$sensor->mac_add])[0];

            // Obtener información del tanque
            $tank = DB::select("
                SELECT tank_area, tank_capacity, max_height 
                FROM tank_sensorsdb WHERE mac_add = ?
            ", [$sensor->mac_add])[0];

            // Cálculos
            $volume = ((floatval($tank->max_height) - floatval($height->water_distance)) / 1000) * floatval($tank->tank_area);
            $mass = $volume * 1000;

            $totalCapacity += floatval($tank->tank_capacity);
            $totalMass += $mass;
            $totalVolume += $volume;
        }

        $totalFill = $totalCapacity > 0 ? ($totalMass / $totalCapacity) : 0;

        return [
            'totalMass' => round($totalMass, 0),
            'totalFill' => round($totalFill * 100, 0),
            'tankNum' => $tankNum,
            'totalVolume' => round($totalVolume, 2),
        ];
    }

    public function index($id)
    {
        $waterData = $this->getWaterData($id);
        
        return Inertia::render('WaterDashboard', $waterData);
    }
} 