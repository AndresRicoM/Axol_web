<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HomehubActivity;
use Carbon\Carbon;


class HomehubActivityController extends Controller
{
    // Method to save data to the homehub_activity_practice table
    public function registerHomehubActivity(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'mac_add' => 'required|string',
            'activity' => 'required|integer',
        ]);
        $validated["datetime"] = Carbon::now();


        try {
            // Create a new HomehubActivity record
            $homehubActivity = HomehubActivity::create($validated);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Error saving activity: $e"
            ], 500);
        }


        // Return a response
        return response()->json([
            'message' => 'Homehub Activity data saved successfully',
            'data' => $homehubActivity
        ], 201);
    }
}
