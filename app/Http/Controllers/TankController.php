<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class TankController extends Controller
{
    public function getTank(Request $request)
    {
        return response()->json([
            'message' => 'Welcome to Tank!!!!',
        ], 200);
    }
}
