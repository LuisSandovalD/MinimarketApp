<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request)
    {
        // Si el usuario ya ha verificado su email, devolvemos un mensaje
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Ya verificado']);
        }

        // Reenviamos el correo de verificación
        $request->user()->sendEmailVerificationNotification();

        // Devolvemos una respuesta de éxito
        return response()->json(['message' => 'Correo de verificación reenviado']);
    }
}
