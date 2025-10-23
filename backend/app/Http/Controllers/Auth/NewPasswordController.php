<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use App\Models\User;
use Illuminate\Support\Str;

class NewPasswordController extends Controller
{
    public function store(Request $request)
    {
        // Validamos el token, email y nueva contraseña
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|confirmed|min:8',
        ]);

        // Intentamos restablecer la contraseña
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

        // Mensaje de éxito o error
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Contraseña restablecida correctamente'])
            : response()->json(['message' => 'Error al restablecer la contraseña'], 500);
    }
}
