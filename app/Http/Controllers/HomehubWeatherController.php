<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HomehubWeather;

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
            'datetime' => 'date',
        ]);

        // Create a new HomehubWeather record
        $homehubWeather = HomehubWeather::create($validatedData);

        // Return a response
        return response()->json([
            'message' => 'Data saved successfully',
            'data' => $homehubWeather
        ], 201);
    }
}
