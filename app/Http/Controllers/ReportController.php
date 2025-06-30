<?php

namespace App\Http\Controllers;

use App\Models\Homehub;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generateReport(Request $request)
    {
        $request->validate([
            'mac_add' => 'required|exists:homehub_devices_practice,mac_add',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $query = Homehub::with([
            'qualitySensors:mac_add,use,paired_with',
            'qualitySensors.logs' => function ($query) use ($request) {
                if ($request->start_date && $request->end_date) {
                    $query->whereBetween('datetime', [
                        $request->start_date,
                        $request->end_date
                    ]);
                }
            },
            'qualitySensors.latestLog:tds,mac_add,datetime,humidity',
            'tankSensors:mac_add,use,diameter,width,height,offset,paired_with,width,depth',
            'tankSensors.logs' => function ($query) use ($request) {
                if ($request->start_date && $request->end_date) {
                    $query->whereBetween('datetime', [
                        $request->start_date,
                        $request->end_date
                    ]);
                }
            },
            'tankSensors:mac_add,use,diameter,width,height,offset,paired_with,width,depth',
        ])->where('mac_add', $request->mac_add)->first();


        return response()->json([
            'data' => $query,
            'message' => 'data succesfully retrieved'
        ], 200);
    }
}
