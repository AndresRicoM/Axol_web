<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Homehub;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Models\Tank;

class HomehubController extends Controller
{
    public function registerHomehub(Request $request)
    {

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            Log::error('User not found');

            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $user_id = $user->user_id;

        try {
            $validated = $request->validate([
                'mac_add' => 'required',
                'lat' => 'required',
                'lon' => 'required',
                'name' => 'required',
            ]);
            $validated['user_id'] = $user_id;
            Log::info('Validated>', ['validated' => $validated]);

            $homehub = Homehub::create($validated);
            Log::info('Homehub created successfully', ['homehub' => $homehub]);

        } catch (\Throwable $th) {
            Log::error('Error creating a new Homehub', ['error' => $th->getMessage()]);

            return response()->json([
                'message' => 'Error creating a new Homehub',
                'Error' => $th->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Homehub registered successfully',
            'data' => $homehub
        ], 201);
    }

    public function getHomehub(Request $request)
    {
        $userId = $request->input('user_id');
        $homehub = Homehub::where('user_id', $userId)->get();
        // $homehubIds = $homehub->pluck('mac_add');

        Log::info('Homehub data:', ['user_id' => $userId, 'homehub' => $homehub]);
        return response()->json([
            "homehub" => $homehub

        ], 200);
    }
}
