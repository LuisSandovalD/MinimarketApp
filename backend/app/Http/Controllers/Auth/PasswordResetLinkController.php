<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Envía un enlace de restablecimiento de contraseña al correo proporcionado.
     */
    public function store(Request $request)
    {
        try {
            // Validar email
            $validated = $request->validate([
                'email' => 'required|email|max:255',
            ]);

            $email = $validated['email'];

            // Limitar frecuencia de solicitudes por usuario/IP (máx. 3 por minuto)
            $key = 'password-reset:' . sha1($email . '|' . $request->ip());
            if (RateLimiter::tooManyAttempts($key, 3)) {
                return response()->json([
                    'status' => 'too_many_requests',
                    'message' => 'Demasiadas solicitudes de restablecimiento. Intente nuevamente más tarde.',
                ], 429);
            }

            RateLimiter::hit($key, 60); // 3 intentos por minuto

            // Enviar enlace de restablecimiento (no indica si el email existe por seguridad)
            $status = Password::sendResetLink(['email' => $email]);

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.',
                ], 200);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'No se pudo enviar el enlace de restablecimiento.',
            ], 500);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Throwable $th) {
            Log::error('Error al enviar enlace de restablecimiento: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al enviar el enlace de restablecimiento.',
            ], 500);
        }
    }
}
