<?php

namespace App\Traits;

trait QualityTrait
{
    public function getAllQualityData($sensor): array
    {
        // Asumiendo que $sensor->logs ya está ordenado por datetime
        $data = $sensor->logs->map(function ($log) {
            return [
                'datetime' => $log->datetime,
                'tds' => $log->tds,
            ];
        })->values()->all();

        return $data;
    }
}
