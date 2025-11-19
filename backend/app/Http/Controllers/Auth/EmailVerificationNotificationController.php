<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Reenvía el correo de verificación de email al usuario autenticado.
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => 'unauthorized',
                    'message' => 'Usuario no autenticado.',
                ], 401);
            }

            // Verificar si ya está verificado
            if ($user->hasVerifiedEmail()) {
                return response()->json([
                    'status' => 'already_verified',
                    'message' => 'El correo electrónico ya ha sido verificado.',
                ], 200);
            }

            // Limitar frecuencia de envío (para evitar abuso)
            $key = 'verify-email:' . $user->id;
            if (RateLimiter::tooManyAttempts($key, 3)) {
                return response()->json([
                    'status' => 'too_many_requests',
                    'message' => 'Has solicitado demasiados reenvíos. Intenta nuevamente más tarde.',
                ], 429);
            }

            RateLimiter::hit($key, 60); // 3 intentos por minuto

            // Enviar notificación
            $user->sendEmailVerificationNotification();

            return response()->json([
                'status' => 'success',
                'message' => 'Correo de verificación reenviado correctamente.',
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Error al reenviar correo de verificación: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al reenviar el correo de verificación.',
            ], 500);
        }
    }
}
