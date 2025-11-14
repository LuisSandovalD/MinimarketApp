<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Verifica si el correo existe antes del inicio de sesión.
     */
    public function checkEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'email'],
            ]);

            $exists = User::where('email', $request->email)->exists();

            if (!$exists) {
                return response()->json([
                    'status' => 'not_found',
                    'message' => 'Correo no encontrado.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Correo válido.',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            Log::error('Error al verificar correo: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al verificar el correo.',
            ], 500);
        }
    }

    /**
     * Inicia sesión y genera un token de acceso.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'status' => 'unauthorized',
                    'message' => 'Credenciales inválidas.',
                ], 401);
            }

            $user = Auth::user();

            // Revocar tokens anteriores (para mayor seguridad)
            $user->tokens()->delete();

            // Crear un nuevo token
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Inicio de sesión exitoso.',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
            ], 200);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al iniciar sesión: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al procesar el inicio de sesión.',
            ], 500);
        }
    }

    /**
     * Cierra sesión del usuario actual.
     */
    public function destroy(Request $request)
    {
        DB::beginTransaction();

        try {
            $user = $request->user();

            if ($user && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Cierre de sesión exitoso.',
            ], 200);

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al cerrar sesión: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al cerrar sesión.',
            ], 500);
        }
    }

    /**
 * Retorna los datos del usuario autenticado.
 */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_active' => $user->is_active,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}