<?php

use App\Http\Controllers\HomehubController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;
use App\Http\Controllers\TankController;
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
    if (Auth::check()) {
        return redirect()->route('dashboard'); 
    }
    
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


Route::get('/dashboard', function () {
    $homehubController = new HomehubController();

    $user = Auth::user();
    $data = $homehubController->getSensors($user);

    // Render the dashboard
    return Inertia::render('Dashboard', [
        'axolData' => $data,
        'user' => $user,
    ]);
})->middleware(['auth', 'verified', 'timezone'])->name('dashboard');

//
Route::get('/community', function () {
    $user = Auth::user();

    // Render the community view
    return Inertia::render('Community', [
        'user' => $user,
    ]);
})->middleware(['auth', 'verified', 'timezone'])->name('community');

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
})->name('logout')->middleware('auth');

// Endpoints que usan la autenticacion y así obtener la sesión del usuario
Route::prefix('api')->middleware('web')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/sensors', [TankController::class, 'getSensors']);
});

require __DIR__ . '/auth.php';
