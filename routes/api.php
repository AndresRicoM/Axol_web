<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomehubController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\TankController;
use App\Http\Controllers\QualityController;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// PREFIX: /api

// Homehub
Route::post('/homehub', [HomehubController::class, 'registerHomehub']);
// Route::post('/homehub', [HomehubController::class, 'getHomehub']);

// Bucket
Route::post('/sensor/bucket', [BucketController::class, 'registerBucket']);
Route::post('/sensor/bucketData', [BucketController::class, 'registerBucketData']);
Route::get('/sensor/bucket', [BucketController::class, 'getBucket']);

// Tank
Route::post('/sensor/tank', [TankController::class, 'registerTank']);
Route::post('/sensor/tankData', [TankController::class, 'registerTanKData']);
Route::get('/sensor/tank', [TankController::class, 'getTank']);
Route::get('/sensors', [TankController::class, 'getSensors']);

Route::get('/sensor/getTankFillPercentage', [TankController::class, 'getTankFillPercentage']);

// Quality
Route::get('/sensor/quality', [HomehubController::class, 'getHomehub']);
Route::get('/sensor/getQuality', [QualityController::class, 'getQualityData']);
Route::post('/sensor/quality', [QualityController::class, 'registerQuality']);
Route::post('/sensor/qualityData', [QualityController::class, 'registerQualityData']);