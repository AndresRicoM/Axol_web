<?php

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
    $waterController = new WaterTankController();
    $qualityController = new QualityController();
    $tankController = new TankController();

    // MAC addresses
    $homehub_mac = 'C8:F0:96:06:72:D4'; // MAC address del HomeHub
    $tank_mac = '90:38:0C:88:1B:24'; // MAC Address de prueba para el tanque
    $quality_mac ='40:22:D8:69:5F:DC'; // MAC Address de prueba para el quality


    // Obtener datos del controlador de agua
    $waterData = $waterController->getWaterData($homehub_mac);

    // Obtener datos del controlador de calidad
    $qualityRequest = request()->merge(['mac_add' => $quality_mac]);
    $qualityData = $qualityController->getQualityData($qualityRequest);

    // Obtener datos del controlador del tanque
    $tankRequest = request()->merge(['mac_add' => $tank_mac]);
    $tankData = $tankController->getTankFillPercentage($tankRequest);

    
    // Renderizar la vista de Inertia y pasar todos los datos
    return Inertia::render('Dashboard', [
        'waterData' => $waterData,
        'qualityData' => $qualityData->getData() ?? [],
        'tankData' => $tankData->getData() ?? []
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
require __DIR__.'/auth.php';
