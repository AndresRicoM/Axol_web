<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Validator;


class AuthController extends Controller
{
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:30',
            'password' => 'required|string|min:3',
        ]);

        // Verificar que los campos recibidos están bien
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        if (RateLimiter::tooManyAttempts($request->username, 5)) {
            return response()->json([
                'message' => 'Demasiados intentos fallidos. Inténtalo de nuevo en 1 minuto.',
            ], 429);
        }


        if (Auth::attempt($request->only('username', 'password'), $request->remember)) {
            RateLimiter::clear($request->username);
            // $request->session()->regenerate();
            session()->regenerate();
            return redirect()->route('welcome');
        }

        RateLimiter::hit($request->username, 60);

        return response()->json([
            'message' => 'Las credenciales no coinciden con nuestros registros.',
        ], 401);
    }
}
