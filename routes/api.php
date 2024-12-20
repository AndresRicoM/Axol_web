<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomehubController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\TankController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// PREFIX: /api

// Homehub
Route::post('/homehub', [HomehubController::class, 'registerHomehub']);
Route::get('/homehub', [HomehubController::class, 'getHomehub']);

// Bucket
Route::post('/sensor/bucket', [BucketController::class, 'registerBucket']);

// Tank
Route::get('/sensor/tank', [HomehubController::class, 'getHomehub']);

// Quality
Route::get('/sensor/quality', [HomehubController::class, 'getHomehub']);