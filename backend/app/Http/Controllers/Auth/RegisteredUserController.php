<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        // ✅ Validar datos
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
        ]);

        // ✅ Crear usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // ✅ Crear roles si no existen
        $roleAdmin = Role::firstOrCreate(['name' => 'administrador']);
        $roleCashier = Role::firstOrCreate(['name' => 'cajero']);

        // ✅ Crear permisos
        $permSales = Permission::firstOrCreate(['name' => 'gestionar ventas']);
        $permProducts = Permission::firstOrCreate(['name' => 'gestionar productos']);

        // ✅ Asignar permisos a roles (solo si no existen)
        $roleAdmin->givePermissionTo([$permSales, $permProducts]);
        $roleCashier->givePermissionTo([$permSales]);

        // ✅ Determinar si es el primer usuario (será administrador)
        $isFirstUser = User::count() === 1;
        $defaultRole = $isFirstUser ? 'administrador' : 'cajero';

        // ✅ Asignar rol por defecto
        $user->assignRole($defaultRole);

        // ✅ Disparar evento de registro
        event(new Registered($user));

        // ✅ Crear token
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Respuesta JSON
        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user,
            'rol_asignado' => $defaultRole,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
