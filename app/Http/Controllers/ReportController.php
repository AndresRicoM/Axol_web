<?php

namespace App\Http\Controllers;

use App\Models\Homehub;
use App\Models\Tank;
use App\Models\User;
use Illuminate\Http\Request;
use Log;

class ReportController extends Controller
{
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
