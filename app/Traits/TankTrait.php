<?php

namespace App\Traits;

use DateInterval;
use DatePeriod;
use DateTime;

/**
 * Trait TankTrait
 * @package App\Traits
 */
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
                if ($previousReading !== null && $currentReading > $previousReading) {
                    //distancia aumentó => nivel bajó => consumo de agua
                    $monthlyConsumption[$month] += ($currentReading - $previousReading) / $sensor['height'] * $tankVolume * 1000;
                }
                $previousReading = $currentReading;
            }
            $monthlyConsumption[$month] = round($monthlyConsumption[$month], 0);
        }

        return $monthlyConsumption;
    }

    public function getConsumptionByRange($sensor, float $tankVolume, string $startDateStr, string $endDateStr): array
    {
        $startDate = new DateTime($startDateStr);
        $endDate = new DateTime($endDateStr);
        $diffMonths = ($endDate->format('Y') - $startDate->format('Y')) * 12 + ($endDate->format('m') - $startDate->format('m'));

        $consumption = [];

        if ($diffMonths <= 3) {
            // Agrupación semanal
            $consumption = $this->getWeeklyConsumption($sensor, $tankVolume, $startDate, $endDate);
        } elseif ($diffMonths <= 12) {
            // Agrupación mensual
            $consumption = $this->getMonthlyConsumptionInRange($sensor, $tankVolume, $startDate, $endDate);
        } else {
            // Agrupación anual
            $consumption = $this->getAnnualConsumption($sensor, $tankVolume, $startDate, $endDate);
        }

        return $consumption;
    }

    protected function getWeeklyConsumption($sensor, float $tankVolume, DateTime $startDate, DateTime $endDate): array
    {
        // Inicializar array de semanas entre fechas con claves "YYYY-Www"
        $period = new DatePeriod(
            $startDate->modify('monday this week'),
            new DateInterval('P1W'),
            $endDate->modify('monday next week')
        );

        $weeklyConsumption = [];
        foreach ($period as $dt) {
            $key = $dt->format("o-\WW"); // año ISO + semana ISO
            $weeklyConsumption[$key] = 0;
        }

        // Agrupar logs por semana ISO
        $logsByWeek = $sensor->logsLast3Years->filter(function ($log) use ($startDate, $endDate) {
            $dtLog = new DateTime($log->datetime);
            return $dtLog >= $startDate && $dtLog <= $endDate;
        })->groupBy(function ($log) {
            $dt = new DateTime($log->datetime);
            return $dt->format("o-\WW");
        });

        // Calcular consumos sumando diferencia entre lecturas en cada semana
        foreach ($logsByWeek as $weekKey => $entries) {
            $previousReading = null;
            foreach ($entries as $log) {
                $currentReading = $log->water_distance / 1000;
                if ($previousReading !== null && $currentReading > $previousReading) {
                    $weeklyConsumption[$weekKey] += ($currentReading - $previousReading) / $sensor['height'] * $tankVolume * 1000;
                }
                $previousReading = $currentReading;
            }
            $weeklyConsumption[$weekKey] = round($weeklyConsumption[$weekKey], 0);
        }
        return $weeklyConsumption;
    }

    protected function getMonthlyConsumptionInRange($sensor, float $tankVolume, DateTime $startDate, DateTime $endDate): array
    {
        // Similar a tu getMonthlyConsumption actual pero con rango dinámico
        $periodStart = new DateTime($startDate->format('Y-m-01'));
        $periodEnd = new DateTime($endDate->format('Y-m-01'));
        $periodEnd->modify('+1 month');
        $period = new DatePeriod(
            $periodStart,
            new DateInterval('P1M'),
            $periodEnd
        );

        $monthlyConsumption = [];
        foreach ($period as $dt) {
            $key = $dt->format('Ym');
            $monthlyConsumption[$key] = 0;
        }

        $logsByMonth = $sensor->logsLast3Years->filter(function ($log) use ($startDate, $endDate) {
            $dtLog = new DateTime($log->datetime);
            return $dtLog >= $startDate && $dtLog <= $endDate;
        })->groupBy(function ($log) {
            return date('Ym', strtotime($log->datetime));
        });

        foreach ($logsByMonth as $month => $entries) {
            $previousReading = null;
            foreach ($entries as $log) {
                $currentReading = $log->water_distance / 1000;
                if ($previousReading !== null && $currentReading > $previousReading) {
                    $monthlyConsumption[$month] += ($currentReading - $previousReading) / $sensor['height'] * $tankVolume * 1000;
                }
                $previousReading = $currentReading;
            }
            $monthlyConsumption[$month] = round($monthlyConsumption[$month], 0);
        }
        return $monthlyConsumption;
    }

    protected function getAnnualConsumption($sensor, float $tankVolume, DateTime $startDate, DateTime $endDate): array
    {
        $startYear = (int)$startDate->format('Y');
        $endYear = (int)$endDate->format('Y');

        $annualConsumption = [];
        for ($year = $startYear; $year <= $endYear; $year++) {
            $annualConsumption[$year] = 0;
        }

        $logsByYear = $sensor->logsLast3Years->filter(function ($log) use ($startDate, $endDate) {
            $dtLog = new DateTime($log->datetime);
            return $dtLog >= $startDate && $dtLog <= $endDate;
        })->groupBy(function ($log) {
            return date('Y', strtotime($log->datetime));
        });

        foreach ($logsByYear as $year => $entries) {
            $previousReading = null;
            foreach ($entries as $log) {
                $currentReading = $log->water_distance / 1000;
                if ($previousReading !== null && $currentReading > $previousReading) {
                    $annualConsumption[$year] += ($currentReading - $previousReading) / $sensor['height'] * $tankVolume * 1000;
                }
                $previousReading = $currentReading;
            }
            $annualConsumption[$year] = round($annualConsumption[$year], 0);
        }

        return $annualConsumption;
    }

    public function getCapturedWater($sensor, float $tankVolume): float
    {
        $logs = $sensor->logs;

        $capturedWater = 0;

        $previousReading = null;
        foreach ($logs as $log) {
            $currentReading = $log->water_distance / 1000;
            if ($previousReading !== null && $currentReading < $previousReading) {
                // distancia disminuyó => nivel subió => captación de agua
                $capturedWater += ($previousReading - $currentReading) / $sensor['height'] * $tankVolume * 1000;
            }
            $previousReading = $currentReading;
        }
        return round($capturedWater, 0);
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
