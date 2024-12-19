<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomehubController;
use App\Http\Controllers\TankController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/homehub', [HomehubController::class, 'registerHomehub']);
Route::get('/homehub', [HomehubController::class, 'getHomehub']);
Route::get('/miguel', [HomehubController::class, 'getHomehub']);

Route::get('/tank', [TankController::class, 'getTank']);