<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquí se definen las rutas que usará tu frontend (React).
| Todas funcionan mediante tokens (Sanctum) y devuelven JSON.
|--------------------------------------------------------------------------
*/

/**
 * 🧾 REGISTRO DE USUARIO
 * - Valida los datos
 * - Crea el usuario
 * - Retorna los datos en JSON
 */
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|confirmed|min:8',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return response()->json([
        'message' => 'Usuario registrado correctamente',
        'user' => $user,
    ], 201);
});


/**
 * 🔐 LOGIN
 * - Verifica credenciales
 * - Elimina tokens anteriores
 * - Crea nuevo token y lo devuelve al frontend
 */
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    /** @var \App\Models\User $user */
    $user = Auth::user();

    // 🧹 Elimina tokens anteriores (opcional, para evitar múltiples sesiones)
    $user->tokens()->delete();

    // 🔑 Crea nuevo token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ]);
});


/**
 * 🚪 LOGOUT
 * - Elimina el token actual (cierra sesión en el dispositivo actual)
 */
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Cierre de sesión exitoso'
    ]);
});


/**
 * 👤 OBTENER USUARIO AUTENTICADO
 * - Devuelve los datos del usuario logueado
 * - Protegido con token
 */
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::get('/ping', function () {
    return response()->json(['message' => 'pong desde Laravel 🚀']);
});
