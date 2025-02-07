<?php

use App\Http\Controllers\HomehubController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;
use App\Http\Controllers\WaterTankController;
use App\Http\Controllers\TankController;
use App\Http\Controllers\QualityController;
use Illuminate\Http\Request;

use App\Models\Homehub;
use App\Models\QualityData;
use App\Models\TankData;
use App\Models\WaterData;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/check-session', function () {
    return response()->json([
        'authenticated' => Auth::check(),
        'user' => Auth::user(),
        'session' => session()->all(),
    ]);
});

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth'])->group(function () {
    Route::get('/welcome', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    })->name('welcome');
});


// Dashboard - protegido por middleware auth y verified
Route::get('/dashboard', function () {
    // Instancia de los controladores
    $homehubController = new HomehubController();
    $qualityController = new QualityController();
    $tankController = new TankController();


    $user = Auth::user();
    $userId = $user->user_id;

    // Obtener los homehubs del usuario
    $homehubRequest = request()->merge(['user_id' => $userId]);
    $homehubData = $homehubController->getHomehub($homehubRequest)->getData()->homehubsMacAdd; // RETURNS A STRING


    $sensorsData = array_map(function ($homehub) use ($qualityController, $tankController) {

        //     return [
        //         "homehub" => gettype($homehub),
        //         "quality" => $homehub
        // ];

        $qualityRequest = request()->merge(['paired_with' => $homehub]);
        $qualityData = $qualityController->getQualityData($qualityRequest)->getData();

        $tankRequest = request()->merge(['paired_with' => $homehub]);
        $tankData = $tankController->getTankFillPercentage($tankRequest)->getData();

        return [
            'homehub' => $homehub,
            'quality' => $qualityData,
            'tank' => $tankData,
        ];
    }, $homehubData);

    // Obtener los sensores del tanque por cada homehub
    // $qualityRequest = request()->merge(['paired_with' => $userId]);
    // $qualityData = $qualityController->getQualitySensors($homehubData->getData());

    // Obtener datos del controlador de agua
    // $waterData = $waterController->getWaterData($homehub_mac);

    // Obtener datos del controlador de calidad
    // $qualityRequest = request()->merge(['mac_add' => $quality_mac]);
    // $qualityData = $qualityController->getQualityData($qualityRequest);

    // // Obtener datos del controlador del tanque
    // $tankRequest = request()->merge(['mac_add' => Auth::user()->id]);
    // $tankData = $tankController->getTankFillPercentage($tankRequest);

    // return Inertia::render('Dashboard', [
    //     // 'user' => $user,
    //     // 'userId' => $userId,
    //     // 'qualityData' => $qualityData->getData() ?? [],
    //     // 'tankData' => $tankData->getData() ?? [],
    //     // 'homehubData' => $homehubData->getData()
    //     'sensorsData' => $sensorsData,
    // ]);

    // All data in json format
    // return response()->json([
    //     'sensorsData' => $sensorsData,
    // ]); 

    return Inertia::render('Dashboard', [
        'sensorsData' => $sensorsData,
        'user' => $user,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Grupo de rutas protegidas por middleware auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Logout
Route::post('/logout', function () {
    Auth::logout(); // Cierra la sesión del usuario
    return redirect('/')->with('success', 'Has cerrado sesión correctamente.');
})->name('logout')->middleware('auth'); // Solo usuarios autenticados pueden cerrar sesión


// Endpoints que usan la autenticacion y así obtener la sesión del usuario
Route::prefix('api')->middleware('web')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/sensors', [TankController::class, 'getSensors']);
});
require __DIR__ . '/auth.php';
