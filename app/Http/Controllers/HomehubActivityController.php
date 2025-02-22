<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HomehubActivity;

class HomehubActivityController extends Controller
{
    // Method to save data to the homehub_activity_practice table
    public function registerHomehubActivity(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'mac_add' => 'required|string',
            'datetime' => 'required|date',
            'activity' => 'required|integer',
        ]);

        // Create a new HomehubActivity record
        $homehubActivity = HomehubActivity::create($validatedData);

        // Return a response
        return response()->json([
            'message' => 'Data saved successfully',
            'data' => $homehubActivity
        ], 201);
    }
}
