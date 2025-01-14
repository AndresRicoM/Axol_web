<?php

namespace App\Http\Controllers;

use App\Models\Tank;
use Illuminate\Http\Request;


class TankController extends Controller
{
    public function getTank(Request $request)
    {
        $paired_with = $request->query('paired_with');
        if(!$paired_with){
            return response()->json([
                'error' => 'El parámetro paired_with es requerido'
            ], 400);
        }

        $tank = Tank::select('mac_add', 'paired_with', 'tank_capacity', 'use', 'tank_area', 'max_height') 
        ->where('paired_with',$paired_with)
        ->get();

        if ($tank->isEmpty()) {
            return response()->json([
                'error' => 'No se encontraron tanques con ese paired_with'
            ], 404);
        }

        return response()->json([
            'data' => $tank
        ], 200);
    }
}
