<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\HomehubWeather;
use Illuminate\Support\Facades\Log;

class HomehubWeatherController extends Controller
{
    // Method to save data to the homehub_climatedatadb_practice table
    public function registerHomehubWeather(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'mac_add' => 'string',
            'temp' => 'numeric',
            'min_temp' => 'numeric',
            'max_temp' => 'numeric',
            'weather_main' => 'string',
            'weather_description' => 'string',
            'pressure' => 'numeric',
            'humidity' => 'numeric',
            'wind_speed' => 'numeric',
            'wind_direction' => 'numeric',
        ]);

        $validatedData['datetime'] = Carbon::now();

        Log::info('Validated> ', ['validated' => $validatedData]);


        try{
            // Create a new HomehubWeather record
            $homehubWeather = HomehubWeather::create($validatedData);
        }catch(\Exception $e){
            return response()->json([
                'message' => "Homehub not registered"
            ], 500);
        }

        // Return a response
        return response()->json([
            'message' => 'Data saved successfully',
            'data' => $homehubWeather
        ], 201);
    }
}
