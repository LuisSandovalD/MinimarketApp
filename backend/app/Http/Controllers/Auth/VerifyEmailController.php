<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class VerifyEmailController extends Controller
{
    /**
     * Verifica el correo electrónico del usuario.
     */
    public function __invoke(Request $request, $id, $hash)
    {
        try {
            // Limitar intentos por IP/usuario para prevenir abuso
            $key = 'verify-email:' . $id . '|' . $request->ip();
            if (RateLimiter::tooManyAttempts($key, 5)) {
                return response()->json([
                    'status' => 'too_many_requests',
                    'message' => 'Demasiados intentos de verificación. Inténtelo más tarde.',
                ], 429);
            }
            RateLimiter::hit($key, 60); // 5 intentos por minuto

            // Buscar usuario
            $user = User::findOrFail($id);

            // Validar hash
            if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
                Log::warning('Intento de verificación con hash inválido', [
                    'user_id' => $id,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'status' => 'invalid_hash',
                    'message' => 'Enlace de verificación inválido o manipulado.',
                ], 403);
            }

            // Si ya fue verificado
            if ($user->hasVerifiedEmail()) {
                return response()->json([
                    'status' => 'already_verified',
                    'message' => 'El correo ya ha sido verificado.',
                ], 200);
            }

            // Marcar como verificado
            if ($user->markEmailAsVerified()) {
                event(new Verified($user)); // Dispara evento estándar de Laravel

                return response()->json([
                    'status' => 'success',
                    'message' => 'Correo verificado correctamente.',
                ], 200);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'No se pudo verificar el correo.',
            ], 500);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Usuario no encontrado.',
            ], 404);

        } catch (\Throwable $th) {
            Log::error('Error al verificar correo electrónico: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al verificar el correo.',
            ], 500);
        }
    }
}
