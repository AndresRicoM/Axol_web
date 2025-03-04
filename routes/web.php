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
    $qualityController = new QualityController();
    $tankController = new TankController();


    $user = Auth::user();
    $userId = $user->user_id;

    #$homehubs = $user->homehubs()->with(['bucketSensors.logs'])->get();
    #dd($homehubs);

    // get user homehubs
    $homehubRequest = request()->merge(['user_id' => $userId]);
    
    $homehubData = $homehubController->getHomehub($homehubRequest)->getData()->homehub; // RETURNS A STRING

    $axolData = array_map(function ($homehub) use ($qualityController, $tankController) {

        //     return [
        //         "type" => gettype($homehub),
        //         "homehub" => $homehub,
        //         'value' => $homehub->mac_add,
        // ];

        if($homehub && isset($homehub->mac_add)){
            $qualityRequest = request()->merge(['paired_with' => $homehub->mac_add]);
        }

        $qualityData = $qualityController->getQualityData($qualityRequest)->getData();

        $tankRequest = request()->merge(['paired_with' => $homehub->mac_add]);

        $tankData = $tankController->getTankFillPercentage($tankRequest)->getData();

        // Merging sensors with the same 'use' attribute
        $groupedSensors = [];
        foreach ($qualityData as $quality) {
            try {
                if(is_object($quality)){
                    $use = $quality->use;
                    if (!isset($groupedSensors[$use])) {
                        $groupedSensors[$use] = [];
                    }
                    $groupedSensors[$use]['quality'] = $quality;
                }
            } catch (\Throwable $th) {
                dd($th);
            }

        }

        foreach ($tankData as $tank) {
            try {
                if(is_object($tank)){
                    $use = $tank->use;
                    if (!isset($groupedSensors[$use])) {
                        $groupedSensors[$use] = [];
                    }
                    $groupedSensors[$use]['storage'] = $tank;
                }
            } catch (\Throwable $th) {
                dd($th);
            }

        }

        // Convierte el array asociativo en un array indexado
        $sensors = array_values($groupedSensors);

        return [
            'homehub' => $homehub,
            'sensors' => $sensors,
            // 'quality' => $qualityData,
            // 'tank' => $tankData,
        ];
    }, $homehubData);


    // All data in json format
    // return response()->json([
    //     'axolData' => $axolData,
    // ]);

    // Render the dashboard
    return Inertia::render('Dashboard', [
        'axolData' => $axolData,
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
})->name('logout')->middleware('auth');

// Endpoints que usan la autenticacion y así obtener la sesión del usuario
Route::prefix('api')->middleware('web')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/sensors', [TankController::class, 'getSensors']);
});
require __DIR__ . '/auth.php';
