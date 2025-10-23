<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetLinkController extends Controller
{
    public function store(Request $request)
    {
        // Validamos el email
        $request->validate(['email' => 'required|email']);

        // Intentamos enviar el enlace de restablecimiento
        $status = Password::sendResetLink($request->only('email'));

        // Mensaje de éxito o error
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Correo de restablecimiento enviado'])
            : response()->json(['message' => 'Error al enviar el correo'], 500);
    }
}
