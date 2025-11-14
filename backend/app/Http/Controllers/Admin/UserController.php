<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * 🔹 Listar usuarios con sus roles y permisos
     */
    public function index()
    {
        $users = User::with(['roles.permissions', 'permissions'])->get();
        return response()->json($users);
    }

    /**
     * 🔹 Actualizar datos, rol y permisos de un usuario
     */
    public function update($id, Request $request)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'nullable|string|exists:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user->update($request->only('name', 'email'));

        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        if (!empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Usuario actualizado correctamente.',
            'user' => $user->load(['roles.permissions', 'permissions']),
        ]);
    }

    /**
     * 🔹 Eliminar usuario
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }
}
