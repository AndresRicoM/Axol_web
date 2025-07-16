<?php

namespace App\Traits;

use DateInterval;
use DatePeriod;
use DateTime;

trait TankTrait
{
    public function getMonthlyConsumption($sensor, float $tankVolume): array
    {
        $startDate = (new DateTime())->modify('-3 years')->modify('first day of january');
        $endDate = new DateTime();

        // Generar array con claves 'YYYYMM' para los últimos 36 meses
        $period = new DatePeriod(
            $startDate,
            new DateInterval('P1M'),
            $endDate->modify('first day of next month')
        );

        $monthlyConsumption = [];
        foreach ($period as $dt) {
            $key = $dt->format('Ym');
            $monthlyConsumption[$key] = 0;
        }

        // Agrupar logs por año y mes 'YYYYMM'
        $logsByMonth = $sensor->logsLast3Years->groupBy(function ($log) {
            return date('Ym', strtotime($log->datetime));
        });

        foreach ($logsByMonth as $month => $entries) {
            $previousReading = null;
            foreach ($entries as $log) {
                $currentReading = $log->water_distance / 1000;
                if ($previousReading !== null && $currentReading <= $previousReading) {
                    $monthlyConsumption[$month] += ($previousReading - $currentReading) / $sensor['height'] * $tankVolume * 1000;
                }
                $previousReading = $currentReading;
            }
            $monthlyConsumption[$month] = round($monthlyConsumption[$month], 0);
        }

        return $monthlyConsumption;
    }


    public function getVolume($tank): float
    {
        if ($tank['diameter'] > 0) {
            $radius = $tank['diameter'] / 2;
            return pi() * pow($radius, 2) * $tank['height'];
        }
        return $tank['width'] * $tank['depth'] * $tank['height'];
    }
}
