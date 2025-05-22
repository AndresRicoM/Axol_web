<?php

namespace App\Traits;

trait VolumeCalculatorTrait
{
    public function getVolume($tank): float
    {
        if ($tank['diameter'] > 0) {
            $radius = $tank['diameter'] / 2;
            return pi() * pow($radius, 2) * $tank['height'];
        }
        return $tank['width'] * $tank['depth'] * $tank['height'];
    }
}
