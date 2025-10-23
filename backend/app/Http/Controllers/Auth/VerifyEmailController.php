<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke($id, $hash)
    {
        // Verificamos el usuario y el hash
        $user = User::findOrFail($id);

        // Si no exite la verificacion, devolvemos un error
        if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'Hash inválido'], 403);
        }

        // Si existe nos indica que el correo ya fue verificado
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya fue verificado']);
        }

        // Verificamos el email
        $user->markEmailAsVerified();

        // Mensaje de éxito
        return response()->json(['message' => 'Correo verificado correctamente']);
    }
}
