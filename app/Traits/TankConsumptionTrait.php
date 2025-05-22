<?php

namespace App\Traits;

trait TankConsumptionTrait
{
    public function getMonthlyConsumption($sensor, float $tankVolume): array
    {
        $currentMonth = date('m');

        $allMonths = array_map(fn($m) => str_pad($m, 2, "0", STR_PAD_LEFT), range(1, (int) $currentMonth));
        $monthlyConsumption = array_fill_keys($allMonths, 0);

        $logsByMonth = $sensor->logs->groupBy(function ($log) {
            return date('m', strtotime($log->datetime));
        });

        foreach ($logsByMonth as $month => $entries) {
            if ($month > $currentMonth) {
                continue;
            }

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

        // Asegurar formato correcto de las claves
        $monthlyConsumption = array_combine(
            array_map(fn($m) => str_pad($m, 2, "0", STR_PAD_LEFT), array_keys($monthlyConsumption)),
            array_values($monthlyConsumption)
        );

        return $monthlyConsumption;
    }
}
