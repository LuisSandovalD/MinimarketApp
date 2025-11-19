<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictCajeroDelete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user(); // obtiene el usuario autenticado (via Sanctum o sesión)

        // Si no hay usuario autenticado, continuar normalmente (para evitar errores)
        if (!$user) {
            return $next($request);
        }

        // Si el método es DELETE y el usuario tiene rol "cajero"
        if ($request->isMethod('delete') && $user->hasRole('cajero')) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar recursos.'
            ], 403);
        }

        return $next($request);
    }
}
