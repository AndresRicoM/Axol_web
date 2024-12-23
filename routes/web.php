<?php

use Illuminate\Support\Facades\Auth; // Asegúrate de importar el facade Auth
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;
use App\Http\Controllers\WaterTankController;

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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard - protegido por middleware auth y verified
Route::get('/dashboard', function () {
    $waterController = new WaterTankController();
    $homehub_mac = 'C8:F0:96:06:72:D4'; // MAC address del HomeHub
    $waterData = $waterController->getWaterData($homehub_mac);

    return Inertia::render('Dashboard', [
        'waterData' => $waterData
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Grupo de rutas protegidas por middleware auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación personalizadas
Route::middleware('guest')->get('/login', function () {
    return Inertia::render('LoginForm'); // Renderiza el formulario de login
})->name('login');

Route::middleware('guest')->post('/login', [AuthController::class, 'login']); // Maneja el inicio de sesión

// Logout
Route::post('/logout', function () {
    Auth::logout(); // Cierra la sesión del usuario
    return redirect('/')->with('success', 'Has cerrado sesión correctamente.');
})->name('logout')->middleware('auth'); // Solo usuarios autenticados pueden cerrar sesión

require __DIR__.'/auth.php';
