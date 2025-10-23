<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 🧹 Limpiar caché de roles y permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🧩 Crear permisos
        $permSales = Permission::firstOrCreate(['name' => 'gestionar ventas']);
        $permProducts = Permission::firstOrCreate(['name' => 'gestionar productos']);

        // 🧩 Crear roles
        $roleAdmin = Role::firstOrCreate(['name' => 'administrador']);
        $roleCashier = Role::firstOrCreate(['name' => 'cajero']);

        // 🧩 Asignar permisos a roles
        $roleAdmin->givePermissionTo([$permSales, $permProducts]);
        $roleCashier->givePermissionTo([$permSales]);

        // 👤 Crear usuario administrador por defecto
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador General',
                'password' => Hash::make('admin123'),
            ]
        );

        // 🔐 Asignar rol administrador al usuario
        if (!$admin->hasRole('administrador')) {
            $admin->assignRole($roleAdmin);
        }

        $this->command->info('✅ Roles, permisos y usuario administrador creados correctamente.');
        $this->command->info('👤 Usuario: admin@example.com | 🔑 Contraseña: admin123');
    }
}
