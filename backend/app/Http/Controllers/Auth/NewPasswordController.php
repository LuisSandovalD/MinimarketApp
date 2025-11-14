<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\User;

class NewPasswordController extends Controller
{
    /**
     * Restablece la contraseña del usuario mediante token válido.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validación de los datos de entrada
            $validated = $request->validate([
                'token' => 'required|string',
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string|confirmed|min:8',
            ]);

            // Intentar restablecer la contraseña
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Contraseña restablecida correctamente.',
                ], 200);
            }

            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => __($status),
            ], 400);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al restablecer contraseña: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al restablecer la contraseña.',
            ], 500);
        }
    }
}
