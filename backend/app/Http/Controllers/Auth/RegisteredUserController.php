<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validar datos de entrada
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|confirmed|min:8',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            // Crear usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Crear roles si no existen
            $roleAdmin = Role::firstOrCreate(['name' => 'administrador']);
            $roleCashier = Role::firstOrCreate(['name' => 'cajero']);

            // Crear permisos si no existen
            $permSales = Permission::firstOrCreate(['name' => 'gestionar ventas']);
            $permProducts = Permission::firstOrCreate(['name' => 'gestionar productos']);

            // Asignar permisos a roles
            $roleAdmin->syncPermissions([$permSales, $permProducts]);
            $roleCashier->syncPermissions([$permSales]);

            // Determinar si es el primer usuario (será administrador)
            $isFirstUser = User::count() === 1;
            $defaultRole = $isFirstUser ? 'administrador' : 'cajero';

            // Asignar rol al usuario
            $user->assignRole($defaultRole);

            // Disparar evento de registro
            event(new Registered($user));

            // Generar token de acceso
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Usuario registrado correctamente.',
                'user' => $user,
                'rol_asignado' => $defaultRole,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error al registrar usuario: ' . $th->getMessage(), [
                'file' => $th->getFile(),
                'line' => $th->getLine()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al registrar el usuario.',
            ], 500);
        }
    }
}
